# Agent Core Rules

1. **Language & Comments:** Tüm kod içi yorum satırları (comments) DAİMA ve SADECE İngilizce yazılacaktır.
2. **Communication:** Laf kalabalığı yapmak yasaktır. Sadece sorulan soruya net cevap verilecek ve doğrudan istenen kod üretilecektir. Gereksiz uzun açıklamalardan kaçınılacaktır.
3. **Completeness:** Kodlar "buraya senin kodun gelecek" (placeholder) şeklinde eksik bırakılmayacak, kopyala-yapıştır yapıldığında doğrudan çalışacak şekilde tam verilecektir.
4. **Dependencies:** Kullanıcı açıkça talep etmedikçe yeni paket/kütüphane eklenmeyecektir. Mevcut "Tech Stack" sınırları içinde kalınacaktır.
5. **Modification:** Mevcut kod güncellenirken, sistemin geri kalanını (import'lar, tipler, mimari) bozmamaya azami özen gösterilecektir.
6. **Safety & Stability:** Try-catch blokları ve temel hata yönetimi (error handling) atlanmayacaktır.

**CRITICAL THEME RULE:** Stop using dark: modifiers (like dark:bg-slate-900 or dark:text-white) in your components. The entire point of our global.css architecture is semantic variables. Components should be completely blind to the current theme. Only use semantic classes like bg-surface, text-text, border-border, and text-primary. The global.css will automatically handle the color swap. Refactor the code to strictly follow this rule.
