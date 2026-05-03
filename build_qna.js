const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, PageNumber, PageBreak, VerticalAlign
} = require('docx');
const fs = require('fs');

const NAVY = "1A2B4A";
const BLUE_LIGHT = "EBF3FE";
const PURPLE_LIGHT = "EEEDFE";
const AMBER_LIGHT = "FAEEDA";
const GREEN_LIGHT = "EAF3DE";
const RED_LIGHT = "FCEBEB";
const GRAY_LIGHT = "F5F5F5";
const WHITE = "FFFFFF";

const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const noBorder = { style: BorderStyle.NONE, size: 0, color: "FFFFFF" };
const noBorders = { top: noBorder, bottom: noBorder, left: noBorder, right: noBorder };

function h1(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 360, after: 160 },
    children: [new TextRun({ text, bold: true, size: 32, font: "TH Sarabun New", color: NAVY })]
  });
}

function h2(text) {
  return new Paragraph({
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 280, after: 120 },
    children: [new TextRun({ text, bold: true, size: 28, font: "TH Sarabun New", color: "2C4770" })]
  });
}

function h3(text) {
  return new Paragraph({
    spacing: { before: 200, after: 80 },
    children: [new TextRun({ text, bold: true, size: 26, font: "TH Sarabun New", color: "444444" })]
  });
}

function p(text, opts = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 60, line: 360 },
    children: [new TextRun({ text, size: 24, font: "TH Sarabun New", ...opts })]
  });
}

function pBold(text) {
  return p(text, { bold: true });
}

function bullet(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "bullets", level },
    spacing: { before: 40, after: 40, line: 340 },
    children: [new TextRun({ text, size: 24, font: "TH Sarabun New" })]
  });
}

function numbered(text, level = 0) {
  return new Paragraph({
    numbering: { reference: "numbers", level },
    spacing: { before: 40, after: 40, line: 340 },
    children: [new TextRun({ text, size: 24, font: "TH Sarabun New" })]
  });
}

function qBox(qNum, question) {
  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: [9026],
    rows: [new TableRow({
      children: [new TableCell({
        borders,
        width: { size: 9026, type: WidthType.DXA },
        shading: { fill: NAVY, type: ShadingType.CLEAR },
        margins: { top: 120, bottom: 120, left: 160, right: 160 },
        children: [new Paragraph({
          spacing: { before: 0, after: 0 },
          children: [
            new TextRun({ text: `คำถามที่ ${qNum}: `, bold: true, size: 26, font: "TH Sarabun New", color: "7BDFB8" }),
            new TextRun({ text: question, bold: true, size: 26, font: "TH Sarabun New", color: "FFFFFF" })
          ]
        })]
      })]
    })]
  });
}

function answerBox(content_paragraphs) {
  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: [9026],
    rows: [new TableRow({
      children: [new TableCell({
        borders,
        width: { size: 9026, type: WidthType.DXA },
        shading: { fill: "FAFBFF", type: ShadingType.CLEAR },
        margins: { top: 100, bottom: 100, left: 160, right: 160 },
        children: content_paragraphs
      })]
    })]
  });
}

function keyFact(label, value) {
  return new Paragraph({
    spacing: { before: 40, after: 40, line: 340 },
    children: [
      new TextRun({ text: `${label}: `, bold: true, size: 24, font: "TH Sarabun New", color: "1A2B4A" }),
      new TextRun({ text: value, size: 24, font: "TH Sarabun New" })
    ]
  });
}

function divider() {
  return new Paragraph({
    spacing: { before: 160, after: 160 },
    border: { bottom: { style: BorderStyle.SINGLE, size: 4, color: "DDDDDD" } },
    children: []
  });
}

function sectionLabel(text, color = "534AB7") {
  return new Paragraph({
    spacing: { before: 120, after: 60 },
    children: [new TextRun({ text: `▌ ${text}`, bold: true, size: 24, font: "TH Sarabun New", color })]
  });
}

function noteBox(text) {
  return new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: [9026],
    rows: [new TableRow({
      children: [new TableCell({
        borders,
        width: { size: 9026, type: WidthType.DXA },
        shading: { fill: AMBER_LIGHT, type: ShadingType.CLEAR },
        margins: { top: 80, bottom: 80, left: 160, right: 160 },
        children: [new Paragraph({
          spacing: { before: 0, after: 0 },
          children: [
            new TextRun({ text: "⚠ หมายเหตุ: ", bold: true, size: 22, font: "TH Sarabun New", color: "633806" }),
            new TextRun({ text, size: 22, font: "TH Sarabun New", color: "633806" })
          ]
        })]
      })]
    })]
  });
}

function pageBreak() {
  return new Paragraph({ children: [new PageBreak()] });
}

const doc = new Document({
  numbering: {
    config: [
      {
        reference: "bullets",
        levels: [{
          level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 600, hanging: 300 } } }
        }, {
          level: 1, format: LevelFormat.BULLET, text: "–", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 1000, hanging: 300 } } }
        }]
      },
      {
        reference: "numbers",
        levels: [{
          level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 600, hanging: 300 } } }
        }]
      }
    ]
  },
  styles: {
    default: { document: { run: { font: "TH Sarabun New", size: 24 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "TH Sarabun New" },
        paragraph: { spacing: { before: 360, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "TH Sarabun New" },
        paragraph: { spacing: { before: 280, after: 120 }, outlineLevel: 1 } },
    ]
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 },
        margin: { top: 1080, right: 1080, bottom: 1080, left: 1080 }
      }
    },
    children: [

      // ===== COVER =====
      new Paragraph({ spacing: { before: 2000, after: 80 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "เอกสารเตรียมตอบคำถาม", bold: true, size: 40, font: "TH Sarabun New", color: NAVY })] }),
      new Paragraph({ spacing: { before: 0, after: 80 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "โครงงานวิจัย: ระบบประเมินภาวะรู้คิดอัตโนมัติด้วยแบบทดสอบการวาดนาฬิกาดิจิทัล (dCDT)", bold: true, size: 30, font: "TH Sarabun New", color: NAVY })] }),
      new Paragraph({ spacing: { before: 0, after: 80 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Automated Cognitive Assessment Using the Digital Clock Drawing Test", size: 24, font: "TH Sarabun New", color: "666666", italics: true })] }),
      new Paragraph({ spacing: { before: 80, after: 40 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "ฐาปณีย์ ไชยประภา  |  วท.บ. วิทยาการคอมพิวเตอร์  |  มหาวิทยาลัยธรรมศาสตร์  |  2568", size: 24, font: "TH Sarabun New", color: "444444" })] }),
      new Paragraph({ spacing: { before: 200, after: 0 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "ครอบคลุม 16 คำถามที่กรรมการน่าจะถาม — พร้อมคำตอบโดยละเอียดจากรายงานฉบับสมบูรณ์", size: 22, font: "TH Sarabun New", color: "888888", italics: true })] }),

      pageBreak(),

      // ===== SECTION 1: BACKGROUND =====
      h1("ส่วนที่ 1: พื้นฐานและแนวคิด"),

      // Q1
      qBox("1", "Clock Drawing Test (CDT) คืออะไร?"),
      new Paragraph({ spacing: { before: 8, after: 8 }, children: [] }),
      answerBox([
        sectionLabel("คำนิยามและที่มา", "185FA5"),
        p("แบบทดสอบการวาดนาฬิกา (Clock Drawing Test: CDT) คือเครื่องมือคัดกรองทางประสาทจิตวิทยา (Neuropsychological Screening Tool) ที่ใช้อย่างแพร่หลายในทางคลินิก โดยให้ผู้ถูกทดสอบวาดหน้าปัดนาฬิกาที่สมบูรณ์ พร้อมจัดวางตัวเลข 1–12 และวาดเข็มชี้เวลาที่กำหนด เช่น 10:10 น."),
        sectionLabel("สิ่งที่การทดสอบวัด", "185FA5"),
        bullet("ความจำและการดึงข้อมูล (Memory & Recall) — ผู้ทดสอบต้องจำและเรียกคืนโครงสร้างของนาฬิกา"),
        bullet("มิติสัมพันธ์และการรับรู้เชิงพื้นที่ (Visuospatial Ability) — การจัดวางตัวเลขให้สมมาตรและห่างกันเท่าๆ กัน"),
        bullet("การวางแผนและระบบสั่งการ (Executive Function) — การวางแผนลำดับขั้นตอนการวาด"),
        bullet("ความสามารถในการประมวลผลทางภาษา (Language Processing) — การแปลความหมายของโจทย์เวลาที่กำหนด"),
        sectionLabel("ระบบการให้คะแนน Shulman", "185FA5"),
        p("งานวิจัยนี้ใช้ระบบ Shulman Scale (1993) ซึ่งให้คะแนน 0–5:"),
        bullet("คะแนน 5–4: ปกติ (Shulman ระบุว่า Score 4 เป็นเพียง Benign age-related variability)"),
        bullet("คะแนน 3–0: มีความเสี่ยง (เรียงจากความผิดปกติเล็กน้อยถึงไม่สามารถวาดได้เลย)"),
        sectionLabel("ความสำคัญทางคลินิก", "185FA5"),
        p("CDT ถูกนำมาใช้เพื่อคัดกรองเบื้องต้นสำหรับ Alzheimer's Disease, Parkinson's Disease, Mild Cognitive Impairment (MCI) และภาวะสมองเสื่อมในรูปแบบอื่นๆ โดยใช้เวลาทดสอบเพียง 2–3 นาที เป็นเครื่องมือที่เหมาะกับสถานพยาบาลทุกระดับ"),
      ]),

      new Paragraph({ spacing: { before: 16, after: 16 }, children: [] }),

      // Q2
      qBox("2", "ทำไมต้องเป็น Digital CDT และทำไมแบบ 2 มิติของเราถึงดีกว่า?"),
      new Paragraph({ spacing: { before: 8, after: 8 }, children: [] }),
      answerBox([
        sectionLabel("ข้อจำกัดของ CDT แบบกระดาษ", "C62828"),
        bullet("บันทึกได้เพียง 'ภาพสุดท้าย' (Final Product) เท่านั้น — ข้อมูลพฤติกรรมระหว่างวาดทั้งหมดสูญหาย เช่น ลำดับการวาด ความเร็ว การหยุดคิด แรงกด"),
        bullet("การให้คะแนนขึ้นกับดุลยพินิจของผู้ตรวจ (Subjectivity) — งานวิจัยพบว่า Inter-rater Reliability ของ CDT อยู่ที่ประมาณ 0.70–0.85 เท่านั้น"),
        bullet("ไม่สามารถตรวจจับสัญญาณระยะต้นได้ — ผู้ป่วย MCI บางรายวาดภาพดูปกติ แต่กระบวนการวาดผิดปกติอย่างมีนัยสำคัญ"),
        sectionLabel("ทำไมต้องวิเคราะห์ 2 มิติ (จุดแตกต่างจากระบบอื่น)", "27500A"),
        p("งานวิจัยส่วนใหญ่วิเคราะห์เพียงมิติเดียว — ระบบ dCDT รวม 2 มิติพร้อมกัน:"),
        bullet("มิติที่ 1 — ViT วิเคราะห์ 'ผลลัพธ์': โครงสร้างภาพวาดสุดท้าย"),
        bullet("มิติที่ 2 — Kinematic วิเคราะห์ 'กระบวนการ': พฤติกรรมระหว่างวาด K1–K5"),
        p("ตัวอย่างที่ชัดเจน: ผู้ป่วยบางรายวาดนาฬิกาได้ดูปกติ แต่ใช้เวลา 'คิด' ก่อนวาดเข็ม (K5: Pre-First Hand Latency) นานกว่า 8 วินาที — นี่คือสัญญาณของ Executive Dysfunction ที่การดูรูปเพียงอย่างเดียวตรวจไม่พบ"),
        sectionLabel("ข้อได้เปรียบเพิ่มเติม", "27500A"),
        bullet("เข้าถึงผ่านเว็บเบราว์เซอร์บนแท็บเล็ตทั่วไป — ไม่ต้องซื้ออุปกรณ์เฉพาะ"),
        bullet("Explainable AI ผ่าน EigenCAM Heatmap — แพทย์ตรวจสอบเหตุผลของ AI ได้"),
        bullet("ผลลัพธ์เป็น Hybrid Decision (C0–C7) — แสดงประเภทของความเสี่ยงไม่ใช่แค่ Yes/No"),
      ]),

      pageBreak(),

      // ===== SECTION 2: AI ViT =====
      h1("ส่วนที่ 2: AI Vision Transformer (ViT)"),

      // Q3
      qBox("3", "ทำไมถึงเลือก ViT-B/16?"),
      new Paragraph({ spacing: { before: 8, after: 8 }, children: [] }),
      answerBox([
        sectionLabel("ข้อจำกัดของ CNN สำหรับงานนี้", "C62828"),
        p("CNN (Convolutional Neural Network) มีข้อจำกัดด้าน Local Receptive Field — มองเห็นได้เพียงพื้นที่เล็กๆ ในแต่ละครั้ง ไม่สามารถจับ Global Spatial Relationship ได้โดยตรง ซึ่งจำเป็นมากสำหรับการวิเคราะห์นาฬิกา เช่น ความสัมพันธ์ระหว่างตัวเลขทั้ง 12 ตัว หรือตำแหน่งเข็มเทียบกับทั้งหน้าปัด"),
        sectionLabel("ข้อได้เปรียบของ ViT", "185FA5"),
        bullet("Global Self-Attention Mechanism — ทุก Patch มองเห็นความสัมพันธ์กับทุก Patch พร้อมกันในคราวเดียว ตรวจจับ 'ระยะห่างระหว่างตัวเลข' และ 'ความสมมาตรของหน้าปัด' ได้โดยตรง"),
        bullet("เหมาะกับ Transfer Learning จาก ImageNet — ViT-B/16 ที่ Train บน ImageNet-1k มี Pretrained Feature ที่แข็งแกร่งสำหรับงาน Image Classification ทั่วไป"),
        bullet("มีงานวิจัยรองรับ — งาน API-Net (Raksasat et al.) ซึ่งเป็น Related Work หลักก็ใช้สถาปัตยกรรมที่อิงกับ Attention Mechanism"),
        sectionLabel("ทำไม B/16 ไม่ใช่ B/32 หรือ B/8?", "185FA5"),
        bullet("B/32 (32×32 patch) — Patch ใหญ่เกินไป รายละเอียดเล็กๆ เช่น ตำแหน่งเข็ม หายไปใน Patch เดียวกัน"),
        bullet("B/16 (16×16 patch) — สมดุลระหว่าง Spatial Resolution และ Computational Cost ที่เหมาะสมสำหรับ GPU ฟรีบน Google Colab"),
        bullet("B/8 (8×8 patch) — ละเอียดกว่า แต่ต้องการ Memory และ Compute มากกว่า 4 เท่า เกินขีดจำกัดทรัพยากรของโครงงาน"),
        keyFact("สรุป", "เลือก ViT-B/16 เพราะสมดุลระหว่าง Global Attention ที่ต้องการ + ทรัพยากรที่มีอยู่"),
      ]),

      new Paragraph({ spacing: { before: 16, after: 16 }, children: [] }),

      // Q4
      qBox("4", "Dataset ที่ใช้มาจากไหน นำมาใช้อย่างไร และทำไมต้องยุบรวมคลาส?"),
      new Paragraph({ spacing: { before: 8, after: 8 }, children: [] }),
      answerBox([
        sectionLabel("แหล่งที่มาของ Dataset", "185FA5"),
        p("Dataset มาจากคลังข้อมูลสาธารณะ 'cccnlab' ซึ่งเป็นภาพสแกนกระดาษของการทดสอบ CDT จากงานวิจัยทางการแพทย์ที่เปิดเผยต่อสาธารณะ (Open Dataset) สำหรับการศึกษาวิจัย"),
        keyFact("จำนวนภาพทั้งหมด", "3,108 ภาพ"),
        keyFact("ลักษณะภาพ", "ภาพสแกนจากกระดาษ ให้คะแนนตาม Shulman Scale (0–5)"),
        sectionLabel("เหตุผลที่ยุบรวมคลาส (Class Merging Rationale)", "534AB7"),
        p("คะแนน Shulman เดิมมี 6 คลาส (0–5) ซึ่งหากใช้แบบนั้นจะมีปัญหา:"),
        bullet("ข้อมูลไม่สมดุลอย่างรุนแรงในแต่ละ Sub-class"),
        bullet("เป้าหมายของระบบคือ 'คัดกรองเบื้องต้น' (Screening) ไม่ใช่ 'วินิจฉัยแยกโรค'"),
        bullet("Shulman et al. (1993) ระบุว่า Score 4 เป็นเพียง 'Benign age-related variability' ไม่ถือว่าผิดปกติทางคลินิก"),
        p("จึงยุบเป็น Binary Classification:"),
        bullet("Normal (ปกติ): Score 4–5 → จำนวน 2,670 ภาพ (85.9%)"),
        bullet("Risk (มีความเสี่ยง): Score 0–3 → จำนวน 438 ภาพ (14.1%)"),
        sectionLabel("กระบวนการ Preprocessing", "185FA5"),
        numbered("Binary Class Mapping — จัดกลุ่ม Score 4–5 เป็น Normal, Score 0–3 เป็น Risk"),
        numbered("Exploratory Data Analysis (EDA) — วิเคราะห์ Distribution และยืนยัน Class Imbalance"),
        numbered("Digital Bridge Pipeline — แปลงภาพสแกนให้ใกล้เคียงภาพดิจิทัล (ดูคำถามที่ 5)"),
        numbered("Stratified Split — แบ่งข้อมูลโดยรักษาสัดส่วน 85.9:14.1 ในทุก Fold"),
        noteBox("Class Imbalance นี้สะท้อน 'ความเป็นจริงทางประชากรศาสตร์' ของการคัดกรอง — คนส่วนใหญ่ที่มาทดสอบเป็นคนปกติ ไม่ใช่ข้อบกพร่องของ Dataset"),
      ]),

      pageBreak(),

      // Q5
      qBox("5", "Digital Bridge ทำอะไรบ้างแต่ละขั้นตอน?"),
      new Paragraph({ spacing: { before: 8, after: 8 }, children: [] }),
      answerBox([
        sectionLabel("ปัญหาที่ต้องแก้: Domain Gap", "C62828"),
        p("โมเดลถูก Train บนภาพสแกนกระดาษ แต่ใช้งานจริงกับภาพดิจิทัลจาก Stylus บน Tablet — ความต่างของ 'ลักษณะเส้น' ทำให้โมเดลอาจจำแนกผิดพลาด"),
        sectionLabel("5 ขั้นตอนของ Digital Bridge (ใช้ OpenCV + Scikit-image)", "185FA5"),
        numbered("Otsu's Binarization (แปลงขาวดำ): แปลงภาพสแกนเป็นภาพ Binary 2 สี (ขาว-ดำ) โดยอัตโนมัติ โดย Otsu's Algorithm หาค่า Threshold ที่เหมาะสมที่สุดจาก Histogram ของภาพนั้นๆ — ขจัดสีเทาและรอยสีเหลืองจากกระดาษเก่า"),
        numbered("Adaptive Morphological Dilation (สมานรอยขาด): ขยายเส้นเพื่อปิด Gap ที่เกิดจากการวาดด้วยน้ำหนักมือเบา หรือรอยขาดจากการสแกน ทำให้โครงสร้างเส้นต่อเนื่อง"),
        numbered("Skeletonization / Thinning (ลดเป็น 1px): ลดความหนาของเส้นทั้งหมดให้เหลือ 1 Pixel ที่แกนกลาง (Topological Skeleton) เพื่อให้ได้ 'แกนกระดูก' ของเส้น"),
        numbered("Controlled Dilation (ขยายเป็น 3-5px): ขยายเส้นจาก 1px กลับไปเป็น 3–5px ให้สม่ำเสมอ — เหตุผลสำคัญ: ViT-B/16 วิเคราะห์ผ่าน Patch 16×16px ถ้าเส้นบางเกินไปจะไม่มี 'มวลพื้นที่ (Spatial Mass)' เพียงพอใน Patch"),
        numbered("Resize & Normalize: Bounding Box Crop → Square Padding → Resize เป็น 224×224px → ImageNet Normalization"),
        sectionLabel("ผลลัพธ์ที่ต้องการ", "27500A"),
        p("ภาพสแกนกระดาษที่ผ่านกระบวนการแล้วจะมีลักษณะเส้นสม่ำเสมอ 3–5px ใกล้เคียงกับเส้น Stylus ดิจิทัลจริง ทำให้ Distribution ของ Training Data ใกล้เคียงกับ Inference Data มากขึ้น"),
      ]),

      new Paragraph({ spacing: { before: 16, after: 16 }, children: [] }),

      // Q6
      qBox("6", "การตั้งค่า Training Model โดยละเอียดทุกอย่างพร้อมเหตุผล?"),
      new Paragraph({ spacing: { before: 8, after: 8 }, children: [] }),
      answerBox([
        sectionLabel("Transfer Learning Strategy", "185FA5"),
        keyFact("Base Weights", "ImageNet-1k Pretrained (86 ล้าน Parameters)"),
        keyFact("Layer Freezing", "Freeze 8 Transformer Blocks แรก, Fine-tune 4 Blocks สุดท้าย + Classification Head"),
        p("เหตุผล: ด้วย 86M Parameters แต่มีข้อมูลเพียง ~2,486 ภาพต่อ Fold (80%) — ถ้า Train ทุก Layer จะ Overfit ทันที การ Freeze ช่วยรักษา Feature จาก ImageNet ที่ดีอยู่แล้ว"),
        sectionLabel("Loss Function: Focal Loss (γ=2) + Asymmetric Label Smoothing", "534AB7"),
        p("ทำไมไม่ใช้ Cross-Entropy ปกติ?"),
        bullet("Standard Cross-Entropy ไม่แก้ปัญหา Imbalance — โมเดลจะ 'ทางลัด' โดยเดา Normal ตลอดเพื่อได้ Accuracy ~86%"),
        bullet("Focal Loss (γ=2): ลดน้ำหนักตัวอย่างที่ทำนายง่าย (Normal) บังคับ Gradient ไปที่ Risk Cases ที่ยาก"),
        bullet("Asymmetric Label Smoothing: ε_Risk=0.05, ε_Normal=0.10 — ลด Overconfidence และรับมือกับ Clinical Ambiguity บริเวณรอยต่อ Score 3/4"),
        sectionLabel("Optimizer & Scheduler", "185FA5"),
        keyFact("Optimizer", "AdamW (Adam + Weight Decay) — ช่วย Regularization ลด Overfitting"),
        keyFact("Scheduler", "Cosine Annealing — ลด Learning Rate แบบ Smooth ไม่กระตุก ช่วยให้ลู่เข้า Global Minima"),
        sectionLabel("Training Configuration", "185FA5"),
        keyFact("Batch Size", "16 (ช่วยความเสถียรของ Gradient Calculation)"),
        keyFact("Max Epochs", "50"),
        keyFact("Early Stopping", "หยุดถ้า Validation Loss ไม่ลดลง 10 Epochs ติดต่อกัน"),
        keyFact("Mixed Precision (AMP)", "ใช้เพื่อเพิ่มความเร็วบน Google Colab GPU ฟรี"),
        sectionLabel("Augmentation (ออกแบบตาม Clinical Context)", "534AB7"),
        bullet("Random Rotation ±15°, Translation: ใช้กับทุกกลุ่ม"),
        bullet("Random Perspective Level 0.15: เฉพาะ Score 3 (จำลองความเอียงจากการสแกน)"),
        bullet("Translation Only: เฉพาะ Score 4 (รักษาสัดส่วนความยาวเข็ม)"),
        bullet("Horizontal Flip: ห้ามใช้เด็ดขาดทุกกลุ่ม — เพื่อรักษา Hemispatial Neglect Signal"),
        sectionLabel("Validation: Stratified 5-Fold Cross-Validation", "185FA5"),
        p("แบ่งข้อมูล 3,108 ภาพเป็น 5 ส่วนเท่าๆ กัน โดยรักษาสัดส่วน 85.9:14.1 ในทุก Fold — ทุกภาพได้ทำหน้าที่เป็นทั้ง Train และ Validation ครั้งละ 1 ครั้ง ผลที่ได้จึง Robust และ Unbiased กว่า Train/Test Split ธรรมดา"),
      ]),

      pageBreak(),

      // Q7
      qBox("7", "ผลที่ได้จากการ Train — Learning Curve, Performance Evaluation ทุกอย่าง?"),
      new Paragraph({ spacing: { before: 8, after: 8 }, children: [] }),
      answerBox([
        sectionLabel("ผลสรุปจาก 5-Fold", "185FA5"),
        keyFact("Best Model", "V.3, Fold 1"),
        keyFact("Best Epoch", "Epoch 43 (จาก 50)"),
        keyFact("Best Validation Loss", "0.0260"),
        keyFact("Training Accuracy (Fold 1)", "96.30%"),
        sectionLabel("Learning Curve — สิ่งที่น่าสนใจ: Validation Loss ต่ำกว่า Training Loss", "534AB7"),
        p("สิ่งที่ดูเหมือนผิดปกติ แต่จริงๆ แล้วอธิบายได้ด้วยเหตุผลทางเทคนิค 3 ประการ:"),
        numbered("Augmentation Effect: ระหว่าง Train ภาพถูกดัดแปลงให้ยาก (Rotation, Perspective) — ระหว่าง Validate ใช้ภาพต้นฉบับที่ไม่ถูกดัดแปลง → งาน Validate ง่ายกว่า Train"),
        numbered("Weighted Sampling Effect: ระหว่าง Train บังคับให้เห็น Risk Cases ซ้ำๆ — ระหว่าง Validate ใช้ Distribution จริง (85.9% Normal) ซึ่งโมเดลเก่งอยู่แล้ว"),
        numbered("Asymmetric Label Smoothing Effect: ε_Normal=0.10 ทำให้ Training Loss ไม่ลงถึงศูนย์ แต่ Validation ใช้ Label จริง"),
        p("แนวโน้มโดยรวมของทั้ง 2 เส้นลู่ลงอย่างต่อเนื่องโดยไม่มีสัญญาณ Overfitting ชัดเจน"),
        sectionLabel("Performance Evaluation ที่ Threshold 0.50", "185FA5"),
        keyFact("Accuracy", "96.14%"),
        keyFact("Sensitivity (Recall)", "84.09%"),
        p("ชุดทดสอบ: 622 ภาพ (Normal 534, Risk 88)"),
        sectionLabel("Optimal Threshold Tuning ด้วย Youden's J-Index", "534AB7"),
        p("ROC Curve แสดง AUC = 0.926 (ความสามารถในการแยกคลาสสูงมาก)"),
        p("Youden's J-Index = Sensitivity + Specificity - 1 → หา Threshold ที่ Max J → ได้ 0.2741"),
        p("เหตุผลที่ต้องปรับ Threshold: ในบริบทคัดกรองโรค False Negative (พลาดผู้ป่วย) อันตรายกว่า False Positive (เตือนคนปกติ) เราจึงยอมลด Threshold ลงเพื่อเพิ่ม Sensitivity"),
        sectionLabel("Performance หลังปรับ Threshold = 0.2741", "27500A"),
        keyFact("Sensitivity", "85.23% (95% CI: 76.4%–91.5%)  ✅ เกินเกณฑ์ 80% ที่ตั้งไว้"),
        keyFact("Specificity", "97.00%"),
        keyFact("AUC", "0.926"),
        noteBox("F1-Score ถูกระบุเป็น Planned Metric ในรายงาน แต่ค่าจริงไม่ได้รายงานไว้ — ถ้ากรรมการถามให้ตอบตรงๆ ว่าไม่ได้วัดผลไว้ในรายงานฉบับนี้"),
      ]),

      pageBreak(),

      // Q8
      qBox("8", "XAI — ทุกขั้นตอน, วิเคราะห์ผลจากตาราง, ข้อสังเกตที่พบ?"),
      new Paragraph({ spacing: { before: 8, after: 8 }, children: [] }),
      answerBox([
        sectionLabel("XAI คืออะไรและทำไมสำคัญ", "534AB7"),
        p("Explainable AI (XAI) คือการทำให้ AI ที่เป็น 'กล่องดำ' สามารถอธิบายเหตุผลการตัดสินใจได้ ในบริบทการแพทย์สำคัญมากเพราะแพทย์ไม่สามารถยอมรับผลจาก AI โดยไม่มีเหตุผลประกอบ"),
        sectionLabel("ขั้นตอน XAI ของระบบ dCDT", "534AB7"),
        numbered("ดึง Attention Weights จาก ViT Layer สุดท้าย ด้วย 'Chefer's Gradient × Attention Method' (ใช้ขั้นตอนการ Train/Analysis)"),
        numbered("แปลงเป็น Heatmap โดยใช้ EigenCAM (ใช้ใน Backend Deployment) — วิธีนี้ Compute Weight ของแต่ละ Patch ตาม Eigenvalue ของ Gradient"),
        numbered("Overlay Heatmap บนภาพต้นฉบับ: สีแดง = AI ให้ความสนใจมากที่สุด, สีน้ำเงิน = ให้ความสนใจน้อย"),
        numbered("แสดงผลพร้อม Confidence Score ในรายงานผลของระบบ"),
        sectionLabel("วิเคราะห์ผลจากตารางที่ 4.X (XAI Case Study)", "185FA5"),
        p("Score 3 (เข็มสั้นยาวเท่ากัน) → Confidence 80.22% → ทำนายผิด (False Negative):"),
        bullet("Heatmap โฟกัสที่จุดศูนย์กลางหน้าปัดเป็นหลัก", 1),
        bullet("สาเหตุ: ViT-B/16 แบ่ง Patch 16×16px ความต่างของความยาวเข็มเพียงไม่กี่ Pixel อาจตกอยู่ใน Patch เดียวกัน โมเดลมองข้ามไป", 1),
        p("Score 3 (เข็มชี้ผิดเลข) → Confidence 86.11% → ทำนายถูก (True Positive):"),
        bullet("Heatmap โฟกัสที่เข็มและจุดศูนย์กลางร่วมกัน", 1),
        bullet("ความผิดปกติ 'ชัดเจนเชิงโครงสร้าง' เพียงพอสำหรับ 16px Patch", 1),
        p("Score 2 (ตัวเลขกองรวม) → Confidence 85.54% → ทำนายถูก:"),
        bullet("Heatmap โฟกัสที่ตำแหน่งการจัดวางตัวเลขผิดปกติ — สะท้อน Visuospatial Error ได้ชัดเจน", 1),
        p("Score 1 (โครงสร้างบิดเบี้ยว) → Confidence 88.40% → ทำนายถูก:"),
        bullet("Heatmap กระจายทั่วภาพ — โมเดลพยายามค้นหาองค์ประกอบนาฬิกาแต่หาไม่เจอ", 1),
        p("Score 0 (วาดรูปอื่น/วาดไม่ได้) → Confidence 88.34% → ทำนายถูก:"),
        bullet("Heatmap ไม่มีจุดโฟกัสชัดเจน กระจายแบบสุ่ม — ยืนยันว่าไม่พบ Feature ของนาฬิกาเลย", 1),
        sectionLabel("ข้อสังเกตสำคัญ: Confidence Gap", "C62828"),
        p("Accuracy เฉลี่ย 96.14% แต่ Confidence Score ในกรณีทดสอบจริงบน Web App ต่ำถึง 57.6%"),
        p("ข้อสังเกตที่สำคัญมากทางวิชาการ: แม้ Confidence ต่ำ แต่ Heatmap โฟกัสถูกจุด — แสดงว่า Attention Mechanism ทำงานถูกต้อง ปัญหาอยู่ที่ Confidence Calibration ไม่ใช่ Attention Quality"),
        p("4 สาเหตุที่วิเคราะห์ได้:"),
        numbered("Class Imbalance (85.9%:14.1%) — โมเดลไม่มั่นใจกับ Risk Cases"),
        numbered("Patch Resolution 16×16px — ไม่ละเอียดพอสำหรับ Subtle Abnormality"),
        numbered("Generalization Gap — Train/Test ใช้ Dataset เดียวกัน แม้ 5-Fold แล้ว"),
        numbered("Domain Gap — ภาพสแกนกระดาษ vs ภาพดิจิทัลจริง ยังต่างกันอยู่แม้ Digital Bridge แล้ว"),
        p("การค้นพบ Failure Mode ผ่าน XAI นี้ถือเป็น 'ข้อค้นพบที่มีคุณค่าทางวิชาการ' — แสดงว่าโมเดลไม่ได้ผิดพลาดแบบสุ่ม แต่มีข้อจำกัดที่อธิบายได้ทางสถาปัตยกรรม"),
      ]),

      pageBreak(),

      // ===== SECTION 3: KINEMATIC =====
      h1("ส่วนที่ 3: Kinematic Core Logic"),

      // Q9
      qBox("9", "Data Capture, Preprocessing, K1–K5, Age Normalization?"),
      new Paragraph({ spacing: { before: 8, after: 8 }, children: [] }),
      answerBox([
        sectionLabel("Data Capture — HTML5 Canvas + W3C Pointer Events API", "FF8F00"),
        p("ระบบใช้ Raw HTML5 Canvas + W3C Pointer Events API (ไม่ใช้ Fabric.js อย่างที่เขียนใน Ch3 — เปลี่ยนใน Ch4 เพื่อให้ได้ข้อมูลละเอียดกว่า)"),
        p("ข้อมูลที่บันทึกในแต่ละ Event:"),
        bullet("X, Y: พิกัดตำแหน่งปลาย Stylus"),
        bullet("Timestamp (ms): เวลาประทับ"),
        bullet("Pressure: แรงกดของ Stylus"),
        bullet("Azimuth (az), Altitude (alt): มุมเอียงของ Stylus"),
        bullet("Stroke ID: รหัสเส้นวาด"),
        p("สำคัญ: ใช้ Coalesced Pointer Events — บันทึก Event ทุกจุดที่เกิดขึ้นระหว่าง Frame ป้องกันข้อมูลสูญหายเมื่อวาดเร็ว"),
        sectionLabel("Preprocessing", "FF8F00"),
        p("Savitzky-Golay Filter พร้อม Adaptive Window:"),
        bullet("N_window = max(5, round(50ms / Δt_median)) — ปรับขนาด Window ตาม Sampling Rate จริงของอุปกรณ์"),
        bullet("Fallback: ถ้า Timestamp ชนกัน ใช้ 200Hz"),
        p("3-Tier Eligibility Check ก่อนคำนวณแต่ละ Feature:"),
        bullet("Tier 1: t_end > t_start (เวลาถูกต้อง)"),
        bullet("Tier 2: จำนวนจุดพอสำหรับ Smoothing"),
        bullet("Tier 3: Path Length > 0 (มีการเคลื่อนที่จริง)"),
        sectionLabel("5 Kinematic Biomarkers (K1–K5)", "FF8F00"),
        p("K1 — Tremor (อาการสั่น):"),
        bullet("วิธีการ: Dual-Trajectory Architecture — คำนวณ RMS Deviation ระหว่าง Raw Path (จริง) กับ Trajectory B (Reference stiff 350ms window, polyorder=2)"),
        bullet("Threshold: > 0.05 cm (แปลงจาก Pixel ด้วย Device DPI)"),
        bullet("Clinical: สัญญาณ Parkinson's Tremor"),
        p("K2 — Bradykinesia (ความช้า):"),
        bullet("วิธีการ: Average Drawing Velocity จาก Trajectory A (50ms window)"),
        bullet("Threshold: V_avg < 1.2 − (0.005 × age) cm/s"),
        bullet("Clinical: Motor Slowness จาก Parkinson's / ผู้สูงอายุ"),
        p("K3 — Micrographia (แรงกดอ่อน): มี 2 Sub-features"),
        bullet("(a) P_avg < 0.25 (แรงกดเฉลี่ยน้อย)"),
        bullet("(b) Pressure Decrement Ratio: P_last/P_first < 0.70 (แรงกดลดลง >30% จากต้นถึงปลาย)"),
        bullet("Clinical: Motor Fatigue จาก Parkinson's"),
        p("K4 — Hesitation (การลังเล):"),
        bullet("วิธีการ: %ThinkTime = Σ(gaps > 500ms) / Total Time × 100"),
        bullet("Threshold: > 25.0 + (0.2 × age) %"),
        bullet("Clinical: Cognitive Hesitation, MCI, Executive Dysfunction"),
        p("K5 — Pre-First Hand Latency (เวลาวางแผน):"),
        bullet("วิธีการ: Multi-feature stroke classifier (Length F1 + Straightness F2 + Radial Proximity F3) ระบุว่าเส้นไหนคือ 'เข็ม' แล้ววัดเวลาตั้งแต่เริ่มทดสอบ"),
        bullet("Override rule: Straightness >90% AND ต้นเส้นอยู่ภายใน 35% ของรัศมี → บังคับให้เป็นเข็ม"),
        bullet("Threshold: > 8000 + (1500 × floor((age−60)/10)) ms"),
        bullet("Clinical: Executive Dysfunction, Alzheimer's planning deficit"),
        sectionLabel("Age Normalization", "FF8F00"),
        p("K2, K4, K5 ปรับเกณฑ์อัตโนมัติตามอายุ เพราะผู้สูงอายุตามปกติก็วาดช้าและใช้เวลาคิดมากขึ้น:"),
        bullet("K2: Base 1.2 cm/s, ลดลง 0.005 cm/s ต่อปี (Müller et al., 2019)"),
        bullet("K4: Base 25%, เพิ่ม 0.2% ต่อปี"),
        bullet("K5: Base 8,000ms, เพิ่ม 1,500ms ทุก 10 ปีหลังอายุ 60"),
      ]),

      pageBreak(),

      // Q10
      qBox("10", "Truth Table C0–C7 และ Education Bias Correction?"),
      new Paragraph({ spacing: { before: 8, after: 8 }, children: [] }),
      answerBox([
        sectionLabel("การรวมสัญญาณ 3 ด้าน", "534AB7"),
        p("ระบบรวมผลจาก 2 มิติเป็น 3 Binary Signals:"),
        bullet("S_AI = ViT Model Probability ≥ 0.2741 → Normal (0) หรือ Dementia (1)"),
        bullet("S_Motor = OR(K1, K2, K3) → ผิดปกติถ้ามีอย่างน้อย 1 ตัวจาก K1, K2, K3"),
        bullet("S_Cog = OR(K4, K5) → ผิดปกติถ้ามีอย่างน้อย 1 ตัวจาก K4, K5"),
        sectionLabel("Truth Table 8 คลาส (C0–C7)", "534AB7"),
        p("2³ = 8 Combination → 8 Clinical Classes:"),
        bullet("C0: S_AI=N, S_Motor=N, S_Cog=N → ปกติสมบูรณ์"),
        bullet("C1: S_AI=N, S_Motor=✗, S_Cog=N → เสี่ยงกายภาพ (Parkinson's ระยะต้น)"),
        bullet("C2: S_AI=N, S_Motor=N, S_Cog=✗ → สัญญาณรู้คิดระยะต้น (MCI) — จุดสำคัญมาก"),
        bullet("C3: S_AI=N, S_Motor=✗, S_Cog=✗ → เสี่ยงผสม ส่งต่อแพทย์"),
        bullet("C4: S_AI=✗, S_Motor=N, S_Cog=N → รูปวาดผิดปกติ อาจเป็น False Alarm ⚠"),
        bullet("C5: S_AI=✗, S_Motor=N, S_Cog=✗ → รูปแบบ Alzheimer's"),
        bullet("C6: S_AI=✗, S_Motor=✗, S_Cog=N → สมองเสื่อม + ปัญหากายภาพ (PDD)"),
        bullet("C7: S_AI=✗, S_Motor=✗, S_Cog=✗ → บกพร่องรุนแรงทุกด้าน"),
        sectionLabel("3-Tier Risk Output", "534AB7"),
        bullet("🟢 ปกติ: C0 เท่านั้น"),
        bullet("🟡 เฝ้าระวัง: C1, C2, C3, C4"),
        bullet("🔴 เสี่ยงสูง: C5, C6, C7"),
        sectionLabel("Education Bias Correction", "C62828"),
        p("ปัญหา: ผู้ที่มีการศึกษาต่ำอาจวาดนาฬิกาได้ไม่ดีเพราะ 'ขาดทักษะการวาด' ไม่ใช่เพราะ 'สมองเสื่อม' — ถ้าไม่มี Correction ระบบจะ Over-diagnose กลุ่มนี้"),
        p("วิธีแก้: สำหรับ C4–C7 ถ้าการศึกษา < 8 ปี → แสดง Warning Flag แทนการ Auto-downgrade"),
        p("เหตุผลที่ไม่ Auto-downgrade: งานวิจัย Rossetti et al. (2011) ระบุว่าการ Downgrade อาจทำให้พลาดผู้ป่วยจริงในกลุ่มนี้ — เลือกเตือนแพทย์แทนและให้แพทย์ตัดสินใจเอง"),
        p("Logic: 42 Test Cases ถูกออกแบบมาทดสอบ Edge Cases ทั้งหมด รวมถึง Boundary ที่ Threshold 0.2741 และ Education 7/8/9 ปี"),
      ]),

      pageBreak(),

      // Q11
      qBox("11", "บทสรุป คุณค่า และ Future Work?"),
      new Paragraph({ spacing: { before: 8, after: 8 }, children: [] }),
      answerBox([
        sectionLabel("สิ่งที่โครงงานนี้นำเสนอและสำเร็จ", "27500A"),
        bullet("ระบบ dCDT ที่รวม ViT Image Analysis + Kinematic Process Analysis ครั้งแรก — ไม่มีระบบใดใน Literature Review ที่ทำแบบนี้บน Web Platform"),
        bullet("Achieves Sensitivity 85.23% เกินเกณฑ์ที่ตั้งไว้ (80%) พร้อม Specificity 97%"),
        bullet("Deploy ได้จริง: Frontend บน Vercel (Next.js) + Backend บน Hugging Face (FastAPI + ONNX)"),
        bullet("Explainable AI ผ่าน EigenCAM ให้แพทย์ตรวจสอบผลได้"),
        bullet("รองรับ Education Bias — ป้องกัน Over-diagnosis ในกลุ่มการศึกษาต่ำ"),
        sectionLabel("ประโยชน์เชิงปฏิบัติ", "27500A"),
        bullet("เข้าถึงได้ผ่านแท็บเล็ตทั่วไป ไม่ต้องซื้ออุปกรณ์พิเศษ — เหมาะกับ Primary Care ทุกระดับ"),
        bullet("ตรวจพบสัญญาณระยะต้น (C2: MCI) ที่การดูรูปด้วยตาเปล่าไม่สามารถทำได้"),
        bullet("รายงานผลโปร่งใส — แพทย์ไม่ต้องเชื่อ AI 100% แต่ใช้เป็น Decision Support Tool"),
        sectionLabel("Future Work — แก้ปัญหาที่พบและต่อยอด", "534AB7"),
        numbered("แก้ Domain Gap: เก็บข้อมูล Real Clinical Digital Drawing จาก Tablet จริง เพื่อ Re-train หรือ Fine-tune โมเดลบน Digital Distribution โดยตรง"),
        numbered("แก้ Patch Resolution: ทดลอง ViT-B/8 (8×8px) หรือ Hybrid CNN-ViT เพื่อจับ Subtle Abnormality เช่น ความยาวเข็มที่ต่างกันเล็กน้อย"),
        numbered("Confidence Calibration: ใช้ Temperature Scaling หรือ Platt Scaling เพื่อให้ Confidence Score สะท้อนความน่าจะเป็นที่แท้จริง"),
        numbered("Rule-based Geometric Analysis: เพิ่มการวัดความยาวเข็มด้วย Geometry เพื่อ Supplement ViT ในกรณี Score 3 ที่ AI พลาด"),
        numbered("Clinical Validation: ทดสอบระบบเทียบกับ MMSE/MoCA บน Independent Clinical Dataset เพื่อยืนยัน Sensitivity และ Specificity"),
        numbered("Multi-modal Fusion: แทนที่ Rule-based Truth Table ด้วย Trained Classifier ที่รับ ViT Features + Kinematic Features ร่วมกัน"),
      ]),

      pageBreak(),

      // ===== SECTION 4: ADDITIONAL Q =====
      h1("ส่วนที่ 4: คำถามเพิ่มเติมที่กรรมการน่าจะถาม"),

      // Q12
      qBox("12", "ระบบ Deploy ที่ไหน ใครเข้าถึงได้ และความปลอดภัยของข้อมูลผู้ป่วย?"),
      new Paragraph({ spacing: { before: 8, after: 8 }, children: [] }),
      answerBox([
        sectionLabel("Architecture การ Deploy", "185FA5"),
        keyFact("Frontend", "Vercel (Next.js) — ใช้ Serverless Deployment"),
        keyFact("Backend", "Hugging Face Spaces (FastAPI + ONNX Model)"),
        keyFact("Database", "Supabase (PostgreSQL + Supabase Storage สำหรับ Image และ JSON)"),
        sectionLabel("ทำไมเลือก Platform เหล่านี้?", "185FA5"),
        bullet("Vercel: ออกแบบมาสำหรับ Next.js โดยเฉพาะ, Auto Deploy จาก Git, Free Tier เพียงพอ"),
        bullet("Hugging Face: รองรับการ Host ML Model โดยตรง, มี GPU Support, เหมาะกับ ONNX Model"),
        bullet("Supabase: Open-source Firebase Alternative, มี Row-Level Security, เก็บได้ทั้ง Structured (PostgreSQL) และ Unstructured (Storage)"),
        sectionLabel("ความปลอดภัยของข้อมูล", "C62828"),
        p("โครงงานนี้เป็น Prototype/Proof-of-Concept — ไม่ได้ใช้กับผู้ป่วยจริง ดังนั้นข้อมูลที่เก็บเป็นข้อมูลทดสอบเท่านั้น"),
        p("สิ่งที่ต้องพัฒนาเพิ่มก่อน Deploy จริงในทางคลินิก:"),
        bullet("Data Anonymization — ลบข้อมูลที่ระบุตัวตนได้"),
        bullet("PDPA Compliance — ขอความยินยอมก่อนเก็บข้อมูล"),
        bullet("End-to-End Encryption — เข้ารหัสข้อมูลระหว่างส่ง"),
        bullet("Authentication — ระบบ Login สำหรับแพทย์ผู้มีสิทธิ์"),
      ]),

      new Paragraph({ spacing: { before: 16, after: 16 }, children: [] }),

      // Q13
      qBox("13", "ทดสอบกับผู้ป่วยจริงไหม?"),
      new Paragraph({ spacing: { before: 8, after: 8 }, children: [] }),
      answerBox([
        sectionLabel("คำตอบตรงๆ", "C62828"),
        p("ยังไม่ได้ทดสอบกับผู้ป่วยจริง เนื่องจาก:"),
        bullet("โครงงานนี้เป็น Final Year Project ระดับปริญญาตรี มีขอบเขตเป็น Proof-of-Concept"),
        bullet("การทดสอบกับผู้ป่วยจริงต้องผ่านคณะกรรมการจริยธรรมการวิจัย (IRB/Ethics Committee) ซึ่งต้องใช้เวลาและกระบวนการเพิ่มเติม"),
        bullet("Dataset ที่ใช้เป็น Public Dataset (cccnlab) ไม่ใช่ข้อมูลจากผู้ป่วยที่รับสมัครโดยตรง"),
        sectionLabel("ผลที่ได้ถือว่ายืนยันได้ในระดับใด?", "185FA5"),
        p("ยืนยันได้ว่า 'โมเดลทำงานได้บน Dataset สาธารณะ' ด้วย Stratified 5-Fold CV และ AUC 0.926 แต่ยังต้องการ Independent Clinical Validation ก่อนใช้จริง"),
        p("นี่คือหนึ่งใน Future Work ที่สำคัญที่สุดของโครงงาน"),
      ]),

      new Paragraph({ spacing: { before: 16, after: 16 }, children: [] }),

      // Q14
      qBox("14", "Threshold 0.2741 ได้มายังไง? Youden's J-Index คืออะไร?"),
      new Paragraph({ spacing: { before: 8, after: 8 }, children: [] }),
      answerBox([
        sectionLabel("Youden's J-Index", "185FA5"),
        p("J = Sensitivity + Specificity − 1"),
        p("เป็น Index ที่หาจุดบน ROC Curve ที่ให้ผลรวมของ Sensitivity และ Specificity สูงที่สุด — สมดุลระหว่างการตรวจพบผู้ป่วย (Sensitivity) และการไม่วินิจฉัยผิดในคนปกติ (Specificity)"),
        sectionLabel("กระบวนการหา Optimal Threshold", "185FA5"),
        numbered("Plot ROC Curve จาก Probability Output ของโมเดล (AUC = 0.926)"),
        numbered("คำนวณ J = Sensitivity + Specificity − 1 ที่ทุก Threshold บน ROC Curve"),
        numbered("เลือก Threshold ที่ให้ค่า J สูงสุด → ได้ 0.2741"),
        p("ผล: Sensitivity เพิ่มจาก 84.09% → 85.23%, Specificity 97.00% — ยังรักษา Specificity สูงอยู่"),
        sectionLabel("ทำไม 0.2741 ถึงต่ำมากเมื่อเทียบกับ 0.50?", "534AB7"),
        p("เพราะ Class Imbalance (85.9% Normal) ทำให้ Probability Distribution เบ้ไปทาง Normal — โมเดลต้องให้ Probability ต่ำมากถึงจะเป็น Risk ดังนั้น Threshold ที่เหมาะสมจึงต่ำกว่า 0.50 มาก"),
      ]),

      new Paragraph({ spacing: { before: 16, after: 16 }, children: [] }),

      // Q15
      qBox("15", "ทำไม Sensitivity ถึงสำคัญกว่า Specificity ในบริบทนี้?"),
      new Paragraph({ spacing: { before: 8, after: 8 }, children: [] }),
      answerBox([
        sectionLabel("หลักการ Screening vs Diagnosis", "185FA5"),
        p("ระบบ dCDT เป็น 'เครื่องมือคัดกรองเบื้องต้น' (Screening Tool) ไม่ใช่เครื่องมือวินิจฉัยสุดท้าย"),
        sectionLabel("Trade-off ของ Error ทั้งสองประเภท", "534AB7"),
        p("False Negative (Sensitivity ต่ำ) = บอกว่าปกติทั้งที่เป็นโรค:"),
        bullet("ผู้ป่วยไม่ได้รับการดูแล", 1),
        bullet("ในโรคสมองเสื่อม ยิ่งวินิจฉัยช้ายิ่งพลาดช่วงเวลาทอง", 1),
        bullet("อันตรายมาก", 1),
        p("False Positive (Specificity ต่ำ) = บอกว่าเสี่ยงทั้งที่ปกติ:"),
        bullet("ผู้ป่วยถูกส่งต่อแพทย์โดยไม่จำเป็น", 1),
        bullet("เสียเวลาและทรัพยากร แต่ยังปลอดภัย เพราะแพทย์จะ Confirm อีกครั้ง", 1),
        bullet("ไม่เป็นอันตราย", 1),
        p("ในบริบท Screening → เราต้องการ Sensitivity สูงกว่า เพื่อไม่พลาดผู้ป่วย → ยอมให้มี False Positive บ้าง"),
        keyFact("เป้าหมาย", "Sensitivity ≥ 80% (ตามที่กำหนดไว้) → ระบบทำได้ 85.23%"),
      ]),

      new Paragraph({ spacing: { before: 16, after: 16 }, children: [] }),

      // Q16
      qBox("16", "HTML5 Canvas + Pointer Events API ต่างจาก Fabric.js อย่างไร ทำไมเปลี่ยน?"),
      new Paragraph({ spacing: { before: 8, after: 8 }, children: [] }),
      answerBox([
        sectionLabel("Fabric.js คืออะไรและข้อจำกัด", "C62828"),
        p("Fabric.js เป็น High-level Canvas Abstraction Library ที่ออกแบบมาสำหรับ Interactive Drawing Applications — แต่มีข้อจำกัดสำคัญสำหรับการวัด Kinematic:"),
        bullet("ไม่ Expose Raw Pointer Event Data เช่น Pressure, Tilt Angle โดยตรง"),
        bullet("Event Handling ถูก Abstract ไว้ชั้นบน อาจมี Latency เพิ่มเติม"),
        bullet("Coalesced Pointer Events ไม่ได้รับการจัดการโดยตรง อาจสูญหายข้อมูลระหว่าง Frame"),
        sectionLabel("ทำไมเปลี่ยนเป็น Raw HTML5 Canvas + Pointer Events API", "27500A"),
        bullet("Coalesced Events: getCoalescedEvents() บน PointerEvent API ดึงทุก Sub-frame Event ที่เกิดขึ้นระหว่าง requestAnimationFrame — ไม่มีข้อมูลสูญหาย"),
        bullet("Direct Pressure Access: event.pressure ให้ค่าโดยตรงจาก Hardware"),
        bullet("Tilt Data: event.tiltX, event.tiltY, event.azimuthAngle — ข้อมูลที่ Fabric.js ไม่ได้ Expose"),
        bullet("Zero Abstraction Overhead — เขียนถึง Canvas Context โดยตรง"),
        keyFact("สรุป", "เปลี่ยนเพราะต้องการข้อมูล Kinematic ที่ละเอียดและครบถ้วนที่สุดเท่าที่ Hardware จะให้ได้"),
      ]),

      pageBreak(),

      // ===== QUICK REFERENCE =====
      h1("ตารางอ้างอิงด่วน — Key Numbers"),
      new Paragraph({ spacing: { before: 8, after: 8 }, children: [] }),

      new Table({
        width: { size: 9026, type: WidthType.DXA },
        columnWidths: [3500, 2263, 3263],
        rows: [
          new TableRow({
            tableHeader: true,
            children: [
              new TableCell({ borders, shading: { fill: NAVY, type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: 3500, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "หัวข้อ", bold: true, size: 22, font: "TH Sarabun New", color: "FFFFFF" })] })] }),
              new TableCell({ borders, shading: { fill: NAVY, type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: 2263, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "ค่า", bold: true, size: 22, font: "TH Sarabun New", color: "FFFFFF" })] })] }),
              new TableCell({ borders, shading: { fill: NAVY, type: ShadingType.CLEAR },
                margins: { top: 80, bottom: 80, left: 120, right: 120 }, width: { size: 3263, type: WidthType.DXA },
                children: [new Paragraph({ children: [new TextRun({ text: "หมายเหตุ", bold: true, size: 22, font: "TH Sarabun New", color: "FFFFFF" })] })] }),
            ]
          }),
          ...[
            ["Dataset ทั้งหมด", "3,108 ภาพ", "จาก cccnlab (Open Dataset)"],
            ["Normal (Score 4–5)", "2,670 ภาพ (85.9%)", "Shulman 4 = Benign age variability"],
            ["Risk (Score 0–3)", "438 ภาพ (14.1%)", "Highly Imbalanced Dataset"],
            ["Model", "ViT-B/16", "86M Parameters, 16×16 Patch"],
            ["Cross-Validation", "Stratified 5-Fold", "80/20 per Fold"],
            ["Best Fold", "Fold 1, Epoch 43", "Validation Loss = 0.0260"],
            ["Loss Function", "Focal Loss (γ=2) + Asymm. Label Smooth", "ε_Risk=0.05, ε_Normal=0.10"],
            ["Batch Size", "16", ""],
            ["Accuracy @ 0.50", "96.14%", "Validation Set 622 ภาพ"],
            ["Sensitivity @ 0.50", "84.09%", "ก่อนปรับ Threshold"],
            ["AUC", "0.926", "ROC Curve"],
            ["Optimal Threshold", "0.2741", "Youden's J-Index"],
            ["Sensitivity (final)", "85.23%", "95% CI: 76.4%–91.5%"],
            ["Specificity (final)", "97.00%", ""],
            ["Heatmap Method", "EigenCAM (Backend)", "Chefer's method (Analysis)"],
            ["Confidence Gap", "96.14% vs 57.6%", "Real-world test vs Dataset accuracy"],
            ["K1 Threshold", "> 0.05 cm RMS", "Fixed"],
            ["K2 Formula", "1.2 − (0.005 × age) cm/s", "Müller et al., 2019"],
            ["K3a Threshold", "P_avg < 0.25", ""],
            ["K3b Threshold", "P_last/P_first < 0.70", "Pressure Decrement"],
            ["K4 Formula", "25.0 + (0.2 × age) %", "% ThinkTime"],
            ["K5 Formula", "8000 + (1500 × floor((age−60)/10)) ms", "Pre-Hand Latency"],
            ["AI Threshold", "0.2741", "S_AI Boundary"],
            ["Education Bias", "< 8 ปี → Warning Flag", "C4–C7 เท่านั้น"],
            ["Frontend Deploy", "Vercel (Next.js)", ""],
            ["Backend Deploy", "Hugging Face (FastAPI + ONNX)", "Opset 17"],
            ["Database", "Supabase (PostgreSQL + Storage)", ""],
          ].map(([topic, value, note], i) =>
            new TableRow({
              children: [
                new TableCell({ borders, shading: { fill: i % 2 === 0 ? WHITE : GRAY_LIGHT, type: ShadingType.CLEAR },
                  margins: { top: 60, bottom: 60, left: 120, right: 120 }, width: { size: 3500, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: topic, size: 20, font: "TH Sarabun New" })] })] }),
                new TableCell({ borders, shading: { fill: i % 2 === 0 ? WHITE : GRAY_LIGHT, type: ShadingType.CLEAR },
                  margins: { top: 60, bottom: 60, left: 120, right: 120 }, width: { size: 2263, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: value, bold: true, size: 20, font: "TH Sarabun New", color: NAVY })] })] }),
                new TableCell({ borders, shading: { fill: i % 2 === 0 ? WHITE : GRAY_LIGHT, type: ShadingType.CLEAR },
                  margins: { top: 60, bottom: 60, left: 120, right: 120 }, width: { size: 3263, type: WidthType.DXA },
                  children: [new Paragraph({ children: [new TextRun({ text: note, size: 20, font: "TH Sarabun New", color: "666666", italics: !!note })] })] }),
              ]
            })
          )
        ]
      }),

      new Paragraph({ spacing: { before: 200, after: 80 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "— จบเอกสารเตรียมตอบคำถาม —", size: 22, font: "TH Sarabun New", color: "999999", italics: true })] }),
      new Paragraph({ spacing: { before: 0, after: 0 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "dCDT Project | ฐาปณีย์ ไชยประภา | มหาวิทยาลัยธรรมศาสตร์ | 2568", size: 20, font: "TH Sarabun New", color: "BBBBBB" })] }),

    ]
  }]
});

Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync('/mnt/user-data/outputs/dCDT_QnA_Preparation.docx', buffer);
  console.log('Done');
});