import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, User } from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  addDoc, 
  setDoc,
  doc,
  deleteDoc,
  updateDoc,
  serverTimestamp, 
  onSnapshot, 
  query, 
  orderBy,
  limit,
  getDocs,
  writeBatch
} from 'firebase/firestore';
// @ts-ignore
import firebaseConfig from '../../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const googleProvider = new GoogleAuthProvider();

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | null;
    email: string | null;
    emailVerified: boolean | null;
    isAnonymous: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  // Extract primitive error message defensively
  let errorMessage = 'Unknown Error';
  let errorCode = 'unknown';
  
  if (error instanceof Error) {
    errorMessage = error.message;
    // Firebase errors often have a 'code' property
    const firebaseErr = error as any;
    if (firebaseErr.code) errorCode = firebaseErr.code;
  } else if (error && typeof error === 'object') {
    const anyError = error as any;
    errorMessage = anyError.message || anyError.code || String(error);
    errorCode = anyError.code || 'object-error';
  } else if (error !== undefined && error !== null) {
    errorMessage = String(error);
  }

  // Debug log the raw error for the console
  console.error(`[Firestore ${operationType}] Raw Error:`, error);

  const errInfo = {
    error: String(errorMessage),
    code: String(errorCode),
    operationType: String(operationType),
    path: path ? String(path) : null,
    context: {
      origin: window.location.origin,
      url: window.location.href,
      timestamp: new Date().toISOString()
    },
    auth: {
      uid: auth.currentUser?.uid || null,
      email: auth.currentUser?.email || null,
      emailVerified: !!auth.currentUser?.emailVerified
    }
  };

  // Completely safe stringify
  let safeJson: string;
  try {
    const cache = new Set();
    safeJson = JSON.stringify(errInfo, (_key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (cache.has(value)) return '[Circular]';
        cache.add(value);
      }
      return value;
    });
  } catch (e) {
    safeJson = `{"error": "JSON_STRINGIFY_FAILED", "originalMessage": "${String(errorMessage).replace(/"/g, '\\"')}"}`;
  }

  throw new Error(safeJson);
}

export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error: any) {
    console.error('Login error:', error);
    
    // Check for common domain-related issues
    if (error.code === 'auth/unauthorized-domain') {
      const msg = `DOMAIN_NOT_AUTHORIZED: Please add "${window.location.hostname}" to your Firebase Console > Authentication > Settings > Authorized domains.`;
      console.error(msg);
      throw new Error(msg);
    }
    
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('LOGIN_CANCELLED: Authentication popup was closed.');
    }

    throw error;
  }
}

export function subscribeToAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function submitContactMessage(name: string, email: string, message: string) {
  try {
    await addDoc(collection(db, 'messages'), {
      name,
      email,
      message,
      createdAt: serverTimestamp(),
      read: false
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'messages');
  }
}

export function subscribeToMessages(callback: (messages: any[]) => void) {
  const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(messages);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'messages');
  });
}

export async function deleteMessage(id: string) {
  try {
    await deleteDoc(doc(db, 'messages', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `messages/${id}`);
  }
}

export async function clearAllLogs() {
  try {
    const q = query(collection(db, 'logs'));
    const snapshot = await getDocs(q);
    const batch = writeBatch(db);
    snapshot.docs.forEach(doc => batch.delete(doc.ref));
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, 'logs');
  }
}

export async function clearAllMessages() {
  try {
    const q = query(collection(db, 'messages'));
    const snapshot = await getDocs(q);
    const deletePromises = snapshot.docs.map(document => deleteDoc(doc(db, 'messages', document.id)));
    await Promise.all(deletePromises);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, 'messages/ALL');
  }
}

// Support for projects (dynamic content)
export function subscribeToProjects(callback: (projects: any[]) => void) {
  const q = query(collection(db, 'projects'), orderBy('order', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const projects = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    callback(projects);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'projects');
  });
}

export async function addProject(project: any) {
  try {
    await addDoc(collection(db, 'projects'), {
      ...project,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'projects');
  }
}

export async function updateProject(id: string, project: any) {
  try {
    await updateDoc(doc(db, 'projects', id), {
      ...project,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `projects/${id}`);
  }
}

export async function deleteProject(id: string) {
  try {
    await deleteDoc(doc(db, 'projects', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `projects/${id}`);
  }
}

// Blog functions
export function subscribeToBlog(callback: (data: any[]) => void) {
  const q = query(collection(db, 'blog'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'blog');
  });
}

export async function addBlogPost(post: any) {
  try {
    await addDoc(collection(db, 'blog'), {
      ...post,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'blog');
  }
}

export async function updateBlogPost(id: string, post: any) {
  try {
    await updateDoc(doc(db, 'blog', id), {
      ...post,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `blog/${id}`);
  }
}

export async function deleteBlogPost(id: string) {
  try {
    await deleteDoc(doc(db, 'blog', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `blog/${id}`);
  }
}

// Contacts functions
export function subscribeToContacts(callback: (data: any[]) => void) {
  const q = query(collection(db, 'contacts'), orderBy('order', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'contacts');
  });
}

export async function addContact(contact: any) {
  try {
    await addDoc(collection(db, 'contacts'), {
      ...contact,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'contacts');
  }
}

export async function updateContact(id: string, contact: any) {
  try {
    await updateDoc(doc(db, 'contacts', id), {
      ...contact,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `contacts/${id}`);
  }
}

export async function deleteContact(id: string) {
  try {
    await deleteDoc(doc(db, 'contacts', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `contacts/${id}`);
  }
}

// Skills functions
export function subscribeToSkills(callback: (data: any[]) => void) {
  const q = query(collection(db, 'skills'), orderBy('order', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'skills');
  });
}

export async function addSkill(skill: any) {
  try {
    await addDoc(collection(db, 'skills'), {
      ...skill,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'skills');
  }
}

export async function updateSkill(id: string, skill: any) {
  try {
    await updateDoc(doc(db, 'skills', id), {
      ...skill,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `skills/${id}`);
  }
}

export async function deleteSkill(id: string) {
  try {
    await deleteDoc(doc(db, 'skills', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `skills/${id}`);
  }
}

// Challenges functions
export function subscribeToChallenges(callback: (data: any[]) => void) {
  const q = query(collection(db, 'challenges'), orderBy('order', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'challenges');
  });
}

export async function addChallenge(challenge: any) {
  try {
    await addDoc(collection(db, 'challenges'), {
      ...challenge,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'challenges');
  }
}

export async function updateChallenge(id: string, challenge: any) {
  try {
    await updateDoc(doc(db, 'challenges', id), {
      ...challenge,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `challenges/${id}`);
  }
}

export async function deleteChallenge(id: string) {
  try {
    await deleteDoc(doc(db, 'challenges', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `challenges/${id}`);
  }
}

// Vault functions
export function subscribeToVault(callback: (data: any[]) => void) {
  const q = query(collection(db, 'vault'), orderBy('order', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'vault');
  });
}

export async function addVaultItem(item: any) {
  try {
    await addDoc(collection(db, 'vault'), {
      ...item,
      createdAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'vault');
  }
}

export async function updateVaultItem(id: string, item: any) {
  try {
    await updateDoc(doc(db, 'vault', id), {
      ...item,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `vault/${id}`);
  }
}

export async function deleteVaultItem(id: string) {
  try {
    await deleteDoc(doc(db, 'vault', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `vault/${id}`);
  }
}

// Stats & Analytics functions
export function subscribeToStats(callback: (stats: any) => void) {
  return onSnapshot(doc(db, 'stats', 'global'), (doc) => {
    callback(doc.exists() ? doc.data() : null);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, 'stats/global');
  });
}

export function subscribeToAnalytics(callback: (logs: any[]) => void) {
  const q = query(collection(db, 'analytics'), orderBy('timestamp', 'desc'), limit(50));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'analytics');
  });
}

// Settings functions
export function subscribeToSettings(callback: (settings: any) => void) {
  return onSnapshot(doc(db, 'settings', 'global'), (doc) => {
    if (doc.exists()) {
      callback({ id: doc.id, ...doc.data() });
    } else {
      callback(null);
    }
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, 'settings/global');
  });
}

export async function updateSettings(settings: any) {
  try {
    await setDoc(doc(db, 'settings', 'global'), {
      ...settings,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, 'settings/global');
  }
}

// System Logs functions
export function subscribeToLogs(callback: (data: any[]) => void) {
  const q = query(collection(db, 'logs'), orderBy('timestamp', 'desc'), limit(100));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, 'logs');
  });
}

export async function addLog(action: string, details: string) {
  try {
    await addDoc(collection(db, 'logs'), {
      action,
      details,
      timestamp: serverTimestamp(),
      adminEmail: auth.currentUser?.email || 'SYSTEM'
    });
  } catch (error) {
    console.error('Error adding log:', error);
  }
}
