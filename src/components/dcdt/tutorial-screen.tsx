"use client"

import { useState } from 'react'
import { useApp } from '@/lib/app-context'
import { Card, CardContent } from '@/components/ui/card'
import { X } from 'lucide-react'

// ─── Step data ────────────────────────────────────────────────────────────────

const steps = [
  {
    number: '1',
    title: 'ทำความคุ้นเคย',
    body: 'ก่อนเริ่มทดสอบ จะมีหน้ากระดานให้คุณลองขีดเขียน เพื่อทำความคุ้นเคยกับปากกาและหน้าจอ',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
  },
  {
    number: '2',
    title: 'รับโจทย์ทดสอบ',
    body: 'ระบบจะแสดงคำสั่งให้วาดภาพนาฬิกา (ระบบจะเริ่มจับเวลาทันทีเมื่อคุณเข้าสู่หน้านี้)',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    ),
  },
  {
    number: '3',
    title: 'ลงมือวาด',
    body: 'วาดภาพนาฬิกาตามคำสั่งให้ครบถ้วนและชัดเจนที่สุด จากนั้นกดปุ่มส่งผลทดสอบ',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
  },
  {
    number: '4',
    title: 'ประมวลผล',
    body: 'รอระบบวิเคราะห์ผลการวาดของคุณเพียงครู่เดียว',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function TutorialScreen() {
  const { setCurrentScreen } = useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="flex flex-col w-full h-full max-w-5xl mx-auto p-4 md:p-6 overflow-hidden">

      {/* ── Header ── */}
      <div className="flex-none shrink-0 flex flex-col items-center mb-4 text-center">
        <h1 className="text-2xl font-bold text-foreground tracking-tight leading-tight">
          วิธีการทดสอบ
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          อ่านขั้นตอนด้านล่างก่อนเริ่มการทดสอบ
        </p>
      </div>

      {/* ── 4-Step Grid ── */}
      <div className="flex-1 min-h-0 w-full flex flex-col justify-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 w-full h-full max-h-full">
          {steps.map((step) => (
            <Card
              key={step.number}
              className="border border-border shadow-sm overflow-hidden"
            >
              <CardContent className="flex flex-col justify-center h-full p-4 gap-2">
                {/* Badge + icon row */}
                <div className="flex items-center gap-3">
                  <div
                    className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white text-base font-bold shadow-sm"
                    style={{ backgroundColor: 'var(--trust-blue)' }}
                  >
                    {step.number}
                  </div>
                  <div
                    className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ color: 'var(--trust-blue)', backgroundColor: 'oklch(0.95 0.03 250)' }}
                  >
                    {step.icon}
                  </div>
                </div>
                {/* Title */}
                <h2 className="text-sm sm:text-base font-bold text-foreground leading-snug">
                  {step.title}
                </h2>
                {/* Body */}
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {step.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ── Footer CTA ── */}
      <div className="flex-none shrink-0 w-full mt-4 flex justify-center">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full max-w-md h-12 text-lg rounded-2xl text-white font-bold shadow-lg hover:opacity-90 transition-opacity active:scale-[0.98]"
          style={{ backgroundColor: 'var(--trust-blue)' }}
        >
          เริ่มต้นใช้งาน
        </button>
      </div>

      {/* ── Confirmation Modal (UNCHANGED) ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full text-center shadow-2xl animate-in zoom-in-95 duration-200">

            {/* Close button */}
            <div className="flex justify-end mb-2">
              <button
                onClick={() => setIsModalOpen(false)}
                aria-label="ปิด"
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Title */}
            <h2 className="text-3xl font-bold text-primary mb-4">
              เลือกขั้นตอนต่อไป
            </h2>

            {/* Body */}
            <p className="text-xl text-gray-700 mb-8">
              คุณต้องการซ้อมวาดเพื่อสร้างความคุ้นเคยก่อน หรือพร้อมที่จะเข้าสู่แบบทดสอบจริง?
              <br /><br />
              <span className="text-red-500 font-semibold">
                ⚠️ คำเตือน: หากเลือกทำแบบทดสอบ ระบบจะแสดงคำสั่งและเริ่มจับเวลาทันที
              </span>
            </p>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setCurrentScreen('practice')}
                className="flex-1 h-16 text-xl font-semibold rounded-2xl border-2 border-foreground bg-white text-foreground hover:bg-gray-50 transition-colors active:scale-[0.98]"
              >
                ซ้อมวาดก่อน
              </button>
              <button
                onClick={() => setCurrentScreen('canvas')}
                className="flex-1 h-16 text-xl font-bold rounded-2xl bg-red-500 text-white shadow-lg hover:bg-red-600 transition-colors active:scale-[0.98]"
              >
                พร้อมทำแบบทดสอบจริง
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  )
}