export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      tracks: {
        Row: {
          album: string
          artist: string
          id: number
          name: string
          popularity: number
          spotify_id: string
        }
        Insert: {
          album?: string
          artist?: string
          id?: number
          name?: string
          popularity?: number
          spotify_id?: string
        }
        Update: {
          album?: string
          artist?: string
          id?: number
          name?: string
          popularity?: number
          spotify_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
