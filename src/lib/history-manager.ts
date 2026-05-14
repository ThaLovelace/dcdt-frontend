// src/lib/history-manager.ts
// Supabase-backed history. All records are stored in the `assessments` table.

import { supabase } from './supabase'

// ── Shared type used by the UI (welcome-screen HistoryModal) ─────────────────
export interface TestRecord {
  id: string
  date: string                          // ISO 8601 — mapped from created_at
  alias: string
  age: string
  education: string
  risk_level: 'normal' | 'mild' | 'high'
  ai_confidence: number
  // Full analysis fields (present when loaded for history report view)
  class_id?: string
  risk_color?: string
  kinematic?: Record<string, unknown>
  domain?: Record<string, unknown>
  warnings?: string[]
  velocity_profile?: number[]
  xai_evidence_b64?: string | null
  processed_image_b64?: string | null
  original_image_b64?: string | null
  raw_strokes?: any[]
  device_dpi?: number
  total_time_seconds?: number
}

// ── Insert a new assessment row ───────────────────────────────────────────────
export async function saveRecord(data: any): Promise<void> {
  try {
    // 🛠️ แมปข้อมูลให้ชื่อคีย์ตรงกับฐานข้อมูลเป๊ะๆ ดักตัวแปร CamelCase ไว้ให้หมด
    const payload = {
      alias: data.alias || 'Unknown',
      age: String(data.age || ''),
      education: String(data.education || ''),
      "deviceDPI": data.deviceDPI || data.device_dpi || 96,
      "totalTimeSeconds": data.totalTimeSeconds || data.total_time_seconds || 0,
      "rawStrokes": data.rawStrokes || null,
      "originalImageB64": data.originalImageB64 || data.original_image_b64 || null,
      class_id: data.class_id || 'C0',
      risk_level: data.risk_level || 'normal',
      risk_color: data.risk_color || 'green',
      ai_confidence: data.ai_confidence || 0,
      model_version: data.model_version || 'vit-b16-chefer-v3.0',
      kinematic: data.kinematic || null,
      domain: data.domain || null,
      warnings: data.warnings || null,
      velocity_profile: data.velocity_profile || null,
      xai_evidence_b64: data.xai_evidence_b64 || null,
      processed_image_b64: data.processed_image_b64 || null,
      is_history: data.is_history || false
    }

    const { error } = await supabase.from('assessments').insert([payload])

    if (error) {
      console.error('[history-manager] Failed to save record:', error.message)
      throw error
    }
    console.log('[history-manager] 🎉 Successfully saved to Supabase!')
  } catch (err) {
    console.error('[history-manager] Unexpected error:', err)
  }
}

// ── Fetch history ordered newest-first ───────────────────────────────────────
export async function fetchHistory(): Promise<TestRecord[]> {
  try {
    const { data, error } = await supabase
      .from('assessments')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('[history-manager] Failed to fetch history:', error.message)
      return []
    }

    // แปลงชื่อคอลัมน์จาก Database กลับมาเป็นรูปแบบที่หน้า UI ต้องการใช้งาน
    return (data ?? []).map((row: any): TestRecord => ({
      id:                  row.id,
      date:                row.created_at,
      alias:               row.alias,
      age:                 String(row.age ?? ''),
      education:           String(row.education ?? ''),
      risk_level:          row.risk_level,
      ai_confidence:       row.ai_confidence,
      class_id:            row.class_id,
      risk_color:          row.risk_color,
      kinematic:           row.kinematic,
      domain:              row.domain,
      warnings:            row.warnings,
      velocity_profile:    row.velocity_profile,
      xai_evidence_b64:    row.xai_evidence_b64,
      processed_image_b64: row.processed_image_b64,
      original_image_b64:  row.originalImageB64 || row.original_image_b64,
      raw_strokes:         row.rawStrokes || row.raw_strokes,
      device_dpi:          row.deviceDPI || row.device_dpi,
      total_time_seconds:  row.totalTimeSeconds || row.total_time_seconds,
    }))
  } catch (err) {
    console.error('[history-manager] Unexpected error fetching history:', err)
    return []
  }
}