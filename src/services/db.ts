import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  Timestamp,
  type DocumentData
} from 'firebase/firestore';
import { db } from '../lib/firebase';

// Helper for handling errors as requested by instructions
function handleFirestoreError(error: unknown, operationType: string, path: string | null) {
  console.error(`Firestore Error [${operationType}] on [${path}]:`, error);
  throw error;
}

export const dbService = {
  // Stats
  async getDashboardStats(teacherId: string) {
    try {
      // Mocked for now to match UI exact values
      return {
        pendingEvaluations: 24,
        gradedThisWeek: 156,
        avgClassScore: 82
      };
    } catch (e) {
      handleFirestoreError(e, 'get', 'stats');
    }
  },

  // Classes
  async getClasses(teacherId: string) {
    try {
      const q = query(collection(db, 'classes'), where('teacherId', '==', teacherId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      handleFirestoreError(e, 'list', 'classes');
    }
  },

  async createClass(teacherId: string, data: any) {
    try {
      return await addDoc(collection(db, 'classes'), { ...data, teacherId, createdAt: Timestamp.now() });
    } catch (e) {
      handleFirestoreError(e, 'create', 'classes');
    }
  },

  // Evaluations
  async getRecentEvaluations(teacherId: string) {
    try {
      const q = query(
        collection(db, 'evaluations'), 
        where('teacherId', '==', teacherId),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      handleFirestoreError(e, 'list', 'evaluations');
    }
  },

  // Rubrics
  async getRubrics(teacherId: string) {
    try {
      const q = query(collection(db, 'rubrics'), where('teacherId', '==', teacherId));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      handleFirestoreError(e, 'list', 'rubrics');
    }
  }
};
