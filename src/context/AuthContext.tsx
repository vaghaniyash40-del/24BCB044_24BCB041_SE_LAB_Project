import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '../types';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  rollNumber?: string;
  division?: string;
  roomNumber?: string;
  block?: string;
  bedNumber?: string;
  avatar?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (emailOrRoll: string, password: string, role: UserRole) => { success: boolean; error?: string };
  logout: () => void;
}

export const DEMO_USERS: Record<UserRole, AuthUser> = {
  student: {
    id: 'STU-B-100',
    name: 'Yash Bhaveshbhai Vaghani',
    email: 'yash.vaghani@hostel.edu',
    rollNumber: '24BCB044',
    division: 'div 1 – (j2)',
    roomNumber: '304',
    block: 'StayWell Boys Wing',
    bedNumber: 'Bed 1',
    role: 'student'
  },
  admin: {
    id: 'ADM-1001',
    name: 'Dr. Rajesh Mehta',
    email: 'admin@hostel.edu',
    role: 'admin'
  },
  warden: {
    id: 'WRD-501',
    name: 'Mr. Rameshwar Sharma',
    email: 'warden1@hostel.edu',
    block: 'StayWell Boys Wing',
    role: 'warden'
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem('hms_auth_user_v3');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('hms_auth_user_v3', JSON.stringify(user));
    } else {
      localStorage.removeItem('hms_auth_user_v3');
    }
  }, [user]);

  const login = (emailOrRoll: string, password: string, role: UserRole) => {
    if (!emailOrRoll.trim() || !password.trim()) {
      return { success: false, error: 'Please enter valid credentials' };
    }

    if (password.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters' };
    }

    const matchedUser = DEMO_USERS[role];
    const loggedUser: AuthUser = {
      ...matchedUser,
      rollNumber: role === 'student' ? (emailOrRoll.toUpperCase().includes('BCB') ? emailOrRoll.toUpperCase() : '24BCB044') : undefined,
      email: emailOrRoll.includes('@') ? emailOrRoll : `${emailOrRoll.toLowerCase()}@hostel.edu`
    };

    setUser(loggedUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
