# تحليل كتالوج Hermann Medizintechnik وخطة إدخاله إلى موقع SPM

## 1. ملخص تنفيذي

تمت مراجعة كتالوج **SPM / Hermann Surgical Instruments — German-Swiss Product Catalog 2026/2027** المرفق، بما يشمل النصوص، الفهرس، صفحات المنتجات، الجداول الفنية، أكواد الأصناف، الصور، وأقسام الجودة والشهادات.

الكتالوج ليس قائمة صغيرة من المنتجات الجاهزة للعرض كبطاقات منفصلة؛ بل هو **كتالوج صناعي واسع** يجمع بين:

- أنظمة وأجهزة غرفة العمليات.
- عائلات كبيرة من الأدوات الجراحية القابلة لإعادة الاستخدام.
- أدوات المناظير والتنظير البطني والمسالك والمناظير الرحمية.
- ملحقات الكي الجراحي والكابلات والأقطاب.
- صواني وحاويات التعقيم والتخزين.
- آلاف التركيبات والاختلافات حسب القطر والطول وزاوية الرؤية ونوع المقبض وحجم الفك والتوافق.

تم استخراج ما يقارب **4,020 مرجع كود صنف فريد قابل للتعرّف آلياً** من نص الكتالوج. هذا الرقم هو مؤشر لحجم البيانات، وليس وعداً بأن كل كود يمثل منتجاً تجارياً مستقلاً؛ بعض الأكواد تمثل Variant أو جزءاً منفرداً أو ملحقاً أو تظهر أكثر من مرة في جداول التوافق.

**التوصية الأساسية:** لا يتم تحويل كل صف في الكتالوج إلى بطاقة منتج مستقلة. الأفضل هو بناء كتالوج هرمي:

> عائلة المنتج ← الموديل/التكوين ← جدول الـ Variants والأكواد ← طلب عرض سعر

بهذا الشكل يظل الموقع سريعاً واحترافياً، ويستطيع الطبيب أو مهندس الأجهزة الوصول إلى الكود الدقيق بدون إغراق صفحة المنتجات بآلاف البطاقات.

---

## 2. معلومات الوثيقة

| البند | النتيجة |
|---|---|
| الاسم الظاهر | SPM CATALOG HERMANN |
| الشركة الشريكة | Hermann Medizintechnik |
| نوع المحتوى | German-Swiss surgical instruments and endoscopy product catalog |
| الإصدار | 2026/2027 |
| عدد الصفحات | 310 صفحة |
| منشئ الملف | Canva |
| اللغة | إنجليزية وألمانية في معظم الجداول |
| الصور المضمنة | 4,389 سجل صورة داخل PDF، تشمل صوراً وأقنعة شفافية وتكرارات، وليست 4,389 صورة منتج مستقلة |
| الأسعار | لا توجد أسعار بيع منشورة في الكتالوج |
| طبيعة البيع المناسبة | Quote-first / Request a Quote |

### بيانات الشركة والشريك كما وردت في الكتالوج

- الكتالوج يقدم SPM باعتبارها شريك Hermann الحصري في مصر.
- يذكر أن Hermann تعمل منذ أكثر من 60 عاماً، وأن التصنيع يتم في Friedingen, Germany وفق صياغة الكتالوج.
- يذكر الكتالوج شهادات **DIN EN ISO 13485:2016** و **MDSAP** لنظام الجودة لدى Hermann.
- يذكر نطاقات مثل Laparoscopy وArthroscopy وGynecology وUrology وGeneral Surgery وMicrosurgery.
- أي ادعاء قانوني أو تنظيمي أو صياغة مثل “exclusive agent” يجب أن يمر بالمراجعة الداخلية قبل نشره بشكل نهائي على الموقع، حتى تظل الصفحة متوافقة مع المستندات الرسمية الحالية.

---

## 3. خريطة الكتالوج الكاملة

| الفصل | الصفحات | حجم البيانات المستخرج تقريباً | العائلات الرئيسية |
|---|---:|---:|---|
| Endoscopy Systems & Equipment | 6–30 | 127 مرجع كود فريد | كاميرات، مصادر إضاءة، مناظير، CO₂، مولدات HF، مضخات، شاشات، عربات وملحقات |
| General Surgery | 31–115 | 766 مرجع كود فريد | مقصات، ملاقط، ماسكات، حاملات إبر، Retractors، أدوات ENT وPlastic Surgery وMaxillofacial |
| Laparoscopy | 116–170 | 1,535 مرجع كود فريد | أدوات قابلة للفك، ملاقط، Biopsy، Clamps، Laparoscopes، Trocars، Clip Appliers، شفط وري |
| Arthroscopy | 171–191 | 191 مرجع كود فريد | Punches، Handles، Grasping Forceps، Shafts، Trocars، Arthroscopes، Electrodes |
| Urology | 192–235 | 506 مرجع كود فريد | Cystoscopy، Urethroscopy، Lithotripsy، Resectoscopy، Nephroscopy، Uretero-renoscopy |
| Hysteroscopy | 236–255 | 156 مرجع كود فريد | Hysteroscopes، Sheaths، Resectoscopy، Ring Applicator، Uterus Manipulator |
| Electrosurgery | 256–284 | 306 مرجع كود فريد | Return Plates، Cables، Handles، Monopolar/Bipolar Electrodes، Argon accessories |
| Containers & Instrument Trays | 285–309 | 578 مرجع كود فريد | Containers، Baskets، Scope Cases، Filters، Dispensers، Fixation systems |

> أرقام الأكواد أعلاه تمثل نتيجة استخراج نصي آلي مع إزالة الـ placeholders الواضحة، لذلك يجب استخدامها لتقدير نطاق المشروع لا كبديل عن مراجعة كل جدول عند استيراد البيانات.

---

## 4. المنتجات والأجهزة الجاهزة للمرحلة الأولى

هذه المنتجات مناسبة لتظهر كـ **Equipment / Systems** ببطاقات مستقلة، لأنها أجهزة واضحة وليست مجرد Variant صغير:

### 4.1 أنظمة الكاميرات

- **H4K-ICG UHD Camera 4K / ICG** — الكود الظاهر: `H97-500-103`
  - 4-chip technology.
  - 4K UHD imaging مع ICG/NIR fluorescence.
  - 10 presets للـ regular وICG.
  - Touch panel و4 configurable buttons.
- **H4K-3100 4K UHD Camera**
  - الكود الأساسي الظاهر: `H97-300-003`.
  - Variant مع USB capture module: `H97-300-103`.
  - 4K UHD، 3-MOS، freeze، digital zoom، presets، image/video capture.
- **HHD-3100 HD Digital 3-MOS Video Camera**
  - `H97-202-003`، وVariant capture: `H97-202-103`.
- **HHD-1100 HD Digital 1-MOS Video Camera**
  - `H97-202-001`، وVariant capture: `H97-202-101`.
- **HHD-1500 HD Digital 1-MOS ECO Camera**
  - `H97-202-501`.

### 4.2 مصادر الإضاءة

- **HLED-ICG LED High-Intensity Light Source / ICG** — `H90-500-500`.
- **HLED-3000**.
- **HLED-1800 / HLED-2500**.

### 4.3 وحدات غرفة العمليات

- **HI-Series CO₂ Insufflators**
  - HI-0020 / HI-0120 — 20 L/min.
  - HI-0030 / HI-0130 — 30 L/min.
  - HI-0045 / HI-0145 — 45 L/min.
  - أكواد الأجهزة الظاهرة: `H95-020-230`, `H95-020-231`, `H95-030-230`, `H95-030-231`, `H95-043-230`, `H95-043-231`.
- **HF Generator HHF 120** — `H98-120-000`.
- **HF Generator HHF 400** — `H98-350-002`.
- **Suction Pump Laparoscopy HSS4000** — `H94-001-000`.
- **Universal Fluid Pump HSS4500** — `H94-201-000`.
- **Medical monitors** — تظهر ضمن فصل Endoscopy وتحتاج استخراجاً يدوياً منظماً من جداول الصفحات 23–27.
- **Trolleys & accessories** — عربات وتجهيزات مرتبطة بالكاميرات ومصادر الإضاءة والمولدات.

هذه الدفعة هي الأنسب لبناء صفحة Hermann قوية بصرياً أولاً: صور كبيرة، مواصفات مختصرة، تطبيقات سريرية، ملحقات متوافقة، وطلب عرض سعر.

---

## 5. تحليل الفصول الجراحية

### 5.1 General Surgery — الصفحات 31–115

هذا فصل أدوات واسع جداً، ويشمل عائلات مثل:

- Scissors، بما فيها TC / Tungsten Carbide وSuper Cut.
- Dissecting scissors وTenotomy وIris وStrabismus وMetzenbaum.
- Forceps وHemostatic forceps وTowel clamps.
- Needle holders، بما فيها Tungsten Carbide.
- Clamps وVulsellum وMosquito وPean.
- Retractors: Weitlaner، Senn، Deaver، Biggs، Dingman، Gorney، Freeman، وغيرها.
- Skin hooks وNasal rasps وNasal speculas.
- Breast retractors وFlap/Scalp/Nerve dissectors.
- Osteotomes وMallets وMorselizers وSaws.
- ENT وMaxillofacial وPlastic Surgery instruments.
- Cannulas وLipo suction accessories.

**طريقة العرض المقترحة:** عائلات حسب الوظيفة، مع بحث بالكود، وصفحات فلاتر للطول والشكل والمادة، وعدم إنشاء بطاقة منفصلة لكل طول صغير إلا عند فتح جدول Variants.

### 5.2 Laparoscopy — الصفحات 116–170

هذا أكبر فصل من حيث كثافة الأكواد، ويحتوي على:

- Rotating / Detachable Instruments.
- Grasping Forceps بأنواع single action وdouble action.
- Biopsy Forceps وClamps.
- Needle Holders مع أو بدون Tungsten Carbide.
- Bipolar coagulation instruments.
- HD وHD+4K Laparoscopes.
- Trocar sleeves، shafts، reducers، seals، Hasson cones.
- Veress insufflation needles.
- Clip appliers.
- Suction / irrigation instruments.
- Monopolar electrodes وaccessories.
- Flexible biopsy forceps وflexible grasping forceps.
- Cleaning brushes وscope/instrument cases.

**مهم:** صفحات Laparoscopy تعتمد على منطق تركيب الكود من نوع المقبض والقطر والطول وشكل الفك. لذلك يجب أن يدعم الموقع Configurator أو Variant matrix بدلاً من إدخال الأكواد يدوياً كبطاقات عشوائية.

### 5.3 Arthroscopy — الصفحات 171–191

- Arthroscopy punches rotatable and detachable.
- Multiple handle models: axial, metal, ratchet, plastic وغيرها.
- Hook scissors، wide jaw punches، scissors punches.
- Grasping forceps.
- One-piece instruments.
- Interference screws.
- Arthroscopy shafts and trocars.
- HD autoclavable arthroscopes.
- Arthroscopic electrodes.

### 5.4 Urology — الصفحات 192–235

- HD telescopes وcold light cables.
- Cystoscope / urethroscope sheaths and obturators.
- Telescope bridges وAlbarran working elements.
- Diathermy loops وDormia stone baskets.
- Flexible button/needle/loop electrodes.
- Optical stone crushing forceps وlithotripsy sheaths.
- Laser cystoscopy sheaths وworking inserts.
- Resectoscopes، working elements، loop/ball/knife/spike/vaporization electrodes.
- Slim وMINI resectoscopy systems مع Quick-Lock.
- Pediatric resectoscopy.
- Urethrotomy instruments وOTIS urethrotome.
- Nephroscopes، nephroscope sheaths، stone grasping forceps، biopsy forceps.
- Semi-rigid uretero-renoscope.
- Dilating bougies، metal catheters، meatus clamps.

### 5.5 Hysteroscopy — الصفحات 236–255

- HD hysteroscopes بزويا 0° و12° و30° و70°.
- Diagnostic examination sheaths.
- Diagnostic continuous-flow sheaths.
- Operating sheaths بقنوات 5 و7 Charr.
- Continuous-flow outer sheaths.
- Hysteroscopy Albarran working accessories.
- Resectoscopy working elements والأقطاب.
- Ring applicator.
- Uterus manipulator مع adapters.
- Cohen intra-uterine probe.
- Uterine tenaculum forceps.
- Saline resectoscope system.

### 5.6 Electrosurgery — الصفحات 256–284

- Reusable rubber return plates.
- Single-use return plates.
- Connecting cables حسب نوع المولد والقطب.
- Premium وEconomic electrode handles.
- Monopolar and bipolar adapters.
- Monopolar connecting cables.
- Bipolar forceps cables.
- Monopolar standard electrodes.
- Dental and cosmetic electrodes.
- Insulated shaft electrodes for body cavities.
- Plastic surgery microdissection needle electrodes.
- Ceramic-insulated needle electrodes.
- Arthroscopy electrodes.
- Laparoscopic ceramic-insulated electrodes.
- Bipolar forceps وmonopolar forceps.
- Argon gas electrodes and accessories.
- Thermo Stapler / Argon generator accessories.

### 5.7 Containers & Instrument Trays — الصفحات 285–309

- Stainless-steel وaluminium containers.
- 1/1، 3/4، 1/2، Mini، Flat، Dental containers.
- Complete containers وsingle parts.
- Colored lids.
- Wire mesh baskets.
- Perforated steel baskets.
- Scope cases.
- Brush dispensers.
- Standard وDental filters، paper وtextile.
- Filter dispensers وholding devices.
- Labels، seals، aluminium plates.
- Fixation bolts، dividing systems، cloth fixation pins.
- Steam-sterilization containers.

هذا الفصل مناسب جداً لصفحة **Sterilization & OR Storage** مع جدول المقاسات والأكواد، بدلاً من بطاقات صور كثيرة.

---

## 6. الهيكل الصحيح داخل موقع SPM

### المستوى الأول: Hermann Portfolio

صفحة شريك واضحة تحت `Hermann Medizintechnik` تحتوي على:

- Hero بصري محترف.
- شعار Hermann وعبارة الوكالة بعد اعتمادها.
- Tabs للتخصصات.
- بحث بالاسم والكود.
- فلاتر: specialty، product family، diameter، length، view angle، sterilization، generator compatibility.
- رابط ثابت لطلب عرض سعر.

### المستوى الثاني: Product Families

أمثلة:

- H4K-ICG 4K / ICG Camera.
- H4K-3100 4K Camera.
- HLED-ICG Light Source.
- HI-Series CO₂ Insufflator.
- HHF Electrosurgical Generators.
- HSS Fluid Pumps.
- HD Laparoscopes.
- Laparoscopic Detachable Instruments.
- Urology Resectoscopy Systems.
- Hysteroscopy Systems.
- Electrosurgical Electrodes.
- Sterilization Containers.

### المستوى الثالث: Variants / SKUs

كل Variant يعرض:

- Item code.
- Product type.
- Diameter.
- Working length.
- Direction of view.
- Jaw pattern / tip / handle type.
- Material: stainless steel / TC / ceramic / titanium حيث يذكرها الكتالوج.
- Sterilization compatibility إن كانت موثقة.
- Generator / scope compatibility.
- Availability: `Request confirmation` بدلاً من اختراع حالة مخزون.

---

## 7. نموذج البيانات المطلوب للإدخال

لكل Family:

```text
brand: Hermann Medizintechnik
familyName
specialty
category
heroImage
shortDescription
detailedDescription
clinicalApplications
keyFeatures
qualityClaims
brochureReference
status
quoteOnly: true

variants[]:
  itemCode
  modelName
  diameter
  workingLength
  directionOfView
  jawPattern
  handleType
  material
  compatibility
  notes
```

ولكل منتج يجب حفظ مصدره بصيغة:

```text
sourceDocument: SPM Hermann Catalog 2026/2027
sourcePage: رقم الصفحة
sourceSection: اسم الفصل
sourceReviewStatus: pending_review | approved
```

هذا مهم لأن الموقع الحالي يحتوي على workflow للمراجعة والجودة والملفات، ولا ينبغي نشر مواصفة أو كود من جدول معقد بدون الاحتفاظ بمرجع الصفحة.

---

## 8. الصور والمواد البصرية

الكتالوج يحتوي على صور منتجات، صور استخدام، جداول، رسوم توضيحية، وشعارات. عدد سجلات الصور داخل PDF كبير جداً لأن الملف يستخدم أقنعة شفافية وعناصر تصميم متكررة.

### ما سيتم فعله عند بدء التنفيذ

1. استخراج صور صفحات الأجهزة الأساسية بجودة مناسبة للويب.
2. إنشاء صور Hero منفصلة للأنظمة الرئيسية.
3. عدم استخدام لقطة جدول كاملة كصورة منتج.
4. استخدام صور الصفحات كمرجع داخلي فقط عندما لا يمكن فصل صورة المنتج بجودة نظيفة.
5. إضافة Alt text دقيق لكل صورة.
6. ضغط الصور ورفعها إلى managed storage، وليس إلى `client/public`.
7. تسجيل مصدر الصورة ورقم الصفحة.

### الدفعة البصرية الأولى المقترحة

- كاميرات H4K/HHD.
- HLED light sources.
- HI insufflators.
- HHF generators.
- HSS pumps.
- Laparoscope families.
- Urology resectoscopy.
- Hysteroscopy.
- Sterilization containers.

---

## 9. ما يجب ألا يتم نشره آلياً

حتى بعد استخراج البيانات، يجب مراجعة العناصر التالية يدوياً:

- أي رقم كود غامض بسبب تشابك الأعمدة في PDF.
- المقاسات التي تحتوي فاصلة عشرية أو صياغات ألمانية/إنجليزية مختلفة.
- توافق الجهاز مع مولد أو منظار محدد.
- Claims مثل CE، MDD، ISO، MDSAP، Made in Germany، وExclusive Agent.
- توفر الصنف أو مدة التوريد.
- أي صورة فيها نص غير واضح أو جزء من جدول.
- أي صياغة عن التعقيم أو إعادة الاستخدام يجب أن تتبع تعليمات الاستخدام الرسمية، وليس مجرد استنتاج من الصورة.

---

## 10. خطة التنفيذ الواقعية

### المرحلة 1 — Hermann Equipment Showcase

إدخال 10–15 عائلة من أجهزة Endoscopy الأساسية مع صفحات ممتازة بصرياً، وطلب عرض سعر، وبدون أسعار.

### المرحلة 2 — Specialist Systems

إضافة عائلات Laparoscopy وUrology وHysteroscopy وArthroscopy، مع Variants منظمة وجداول توافق.

### المرحلة 3 — Surgical Instruments

إضافة General Surgery وLaparoscopic instruments كعائلات قابلة للبحث مع آلاف الأكواد داخل جداول، وليس كبطاقات منفصلة.

### المرحلة 4 — Electrosurgery & Sterilization

إضافة المولدات، الأقطاب، الكابلات، الحاويات، السلال، والفلاتر كقسم مستقل للملحقات والـ OR workflow.

### المرحلة 5 — Quality Review & Publication

- مراجعة كل Family وVariant من Owner/QA.
- ربط PDF أو datasheet المناسب.
- التأكد من alt text.
- فحص mobile/desktop.
- اختبار البحث والفلاتر وروابط طلب السعر.
- نشر checkpoint مستقل لكل مرحلة.

---

## 11. القرار الذي أوصي باعتماده

سأتعامل مع الكتالوج على أنه **Hermann product platform** داخل الموقع، وليس صفحة PDF طويلة أو متجر أصناف عشوائي.

الهيكل الأفضل هو:

> Hermann Portfolio → Specialty → Product Family → Variant / Item Code → Request a Quote

وكل المنتجات ستكون **Quote-first** لأن الكتالوج لا يحتوي على أسعار، ولأن اختيار الأداة يعتمد على المقاس والتوافق والتطبيق الجراحي.

لم يتم نشر منتجات Hermann الجديدة حتى الآن في هذه الخطوة؛ تم الانتهاء من التحليل والتخطيط فقط حتى لا يتم إدخال آلاف الأكواد في بنية غير مناسبة أو نشر مواصفات تحتاج مراجعة.

## الخطوة التالية المقترحة

البدء بالمرحلة الأولى: **Endoscopy Systems & Equipment**، ثم اعتماد شكل Family/Variants قبل تعميمه على بقية الفصول. هذا سيعطي الموقع نتيجة احترافية وقابلة للإدارة، ويمنع أن تتحول صفحة المنتجات إلى قائمة ضخمة يصعب على المستشفى أو المهندس استخدامها.
