import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { subscribeToAuth } from '../lib/firebase';
import LoadingScreen from './LoadingScreen';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = subscribeToAuth((u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  if (loading) {
    return <LoadingScreen onComplete={() => {}} />;
  }

  if (!user) {
    return <Navigate to="/loginriad" replace />;
  }

  // Restrict to specific admin email
  const ADMIN_EMAILS = ['banglag215@gmail.com', 'rkkhan205090@gmail.com'];
  if (!ADMIN_EMAILS.includes(user.email || '')) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
