// 1. Brief lesson summary nested inside a Unit list
export interface LessonSummary {
  id: number;
  title: string;
  lessonOrder: number;
}

export interface Unit {
  id: string; // e.g., "uvod"
  title: string; // e.g., "Úvod"
  unitOrder: number;
  lessons: LessonSummary[];
}

// 1. Vocabulary Item inside a Material
export interface Vocabulary {
  // Add fields here based on what's inside your vocabularies array
  id: number;
  lemma: string;
  translations: Record<string, string>;
  vocabType: string;
}

// 2. Material (Lesson Content)
export interface Material {
  id: number;
  title: string;
  materialType: string; // e.g., "Phrase"
  note: string;
  stepOrder: number;
  vocabularies: Vocabulary[];
  exercises: Exercise[];
}

// 3. Exercise / Quiz Item
export interface Exercise {
  id: string; // UUID from Java
  type: 'TRANSLATION_INPUT' | 'MATCHING' | string;
  prompt: string;
  targetLemma: string | null;
  options: string[] | null;
  pairs: Record<string, string> | null; // Key-value object for matching pairs
  correctAnswer: string | null;
}

// 4. Main Lesson Payload
export interface LessonDetail {
  lessonId: number;
  title: string;
  materials: Material[];
  // exercises: Exercise[];
}

// 5. Request DTOs (Sent to Spring Boot)
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

// 6. Response DTO (Received from Spring Boot)
export interface AuthResponse {
  token: string;
}

// 7. User 
export interface UserResponse{
  id: number;
  username: string;
  password: string;
  email: string;
}

export interface UpdateUserRequest{
  username?: string;
  email?: string;
}
