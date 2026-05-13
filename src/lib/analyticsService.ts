import { collection, addDoc, doc, updateDoc, increment, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function trackVisit() {
  if (typeof window === 'undefined') return;

  const sessionId = sessionStorage.getItem('visit_session_id') || Math.random().toString(36).substring(7);
  sessionStorage.setItem('visit_session_id', sessionId);

  const visitData = {
    timestamp: new Date().toISOString(),
    path: window.location.pathname,
    userAgent: navigator.userAgent,
    referrer: document.referrer || 'direct',
    sessionId: sessionId
  };

  try {
    // 1. Log detailed entry
    await addDoc(collection(db, 'analytics'), visitData);

    // 2. Update global stats
    const statsRef = doc(db, 'stats', 'global');
    const statsSnap = await getDoc(statsRef);

    if (!statsSnap.exists()) {
      await setDoc(statsRef, {
        totalVisits: 1,
        uniqueVisitors: 1,
        lastReset: new Date().toISOString()
      });
    } else {
      // Logic for unique visitors could be more complex, but for now just increment
      await updateDoc(statsRef, {
        totalVisits: increment(1),
        // Only increment unique if it's a new session?
        // Let's just track total for now to keep it simple and performant
      });
    }
  } catch (error) {
    console.error('Analytics failed:', error);
  }
}
