# RITA Food & Drink (rita.com.vn) — Design System

Site tĩnh tiếng Anh (`lang="en"`), không build tool. Code dựng lại theo cấu trúc dự án gần nhất **ritajuice.vn** (cùng cách đặt tên class, hook `…JS`, `js/main.js` nạp module, `assets/library`), giao diện theo thiết kế rita.com.vn (khung 1512 × 900). Hiện đã làm **header + hero + section danh mục + section New releases + section câu chuyện (lon xoay) + footer** ở `index.html`; các trang còn lại là file HTML rỗng (chỉ có `<title>`) để link trong menu / footer trỏ đúng. Khi dựng trang mới: chép nguyên header, dialog menu mobile, footer và 3 thẻ script từ `index.html`, đổi mục đang xem (`current-menu-item` + `aria-current="page"` trên `li` / `a` tương ứng ở cả menu desktop lẫn mobile).

## 1. Quy tắc chung

1. **Chỉ dùng token** trong `:root` (màu, cỡ chữ, khoảng cách, thời gian). Thiếu thì thêm token trước.
2. Hook JS là class `…JS`, **không bao giờ được style**.
3. **Không comment trong code** (CSS / HTML / JS) — người dùng yêu cầu 2026-11-14 bỏ hẳn, kể cả comment giải thích workaround; mọi ghi chú để trong file này.
4. Không dùng `box-shadow`. Không bo góc (thiết kế góc vuông).
5. **Không dùng hiệu ứng chữ lật 3D** cho nút (người dùng bỏ 2026-11-14; đã xoá `LetterSwapModule` và CSS `.letter-swap*` kế thừa từ ritajuice.vn) — chữ nút để trần trong `.button__text`.
6. Ảnh dưới màn hình đầu: `loading="lazy" decoding="async"`, luôn có `width` / `height`. Icon một màu tô bằng `mask` + `currentColor`.
7. **Đặt tên class theo component dùng lại được, không theo trang / section** (người dùng yêu cầu 2026-11-14): nút ‹ › slider là `.slider-arrow` chứ không phải `.hero__arrow`, lưới thẻ là `.card-grid` / `.media-card` chứ không phải `.category-grid`, nền xám là `.bg-surface` chứ không phải `.categories`. Khác biệt theo ngữ cảnh đưa vào token / modifier / biến cục bộ (`--cols`, `--media-ratio`, `--slider-arrow-gap`). Hook JS cũng đặt tên chung (`sliderPrevJS`, `loadMoreJS`) và module tìm hook bên trong phần tử gốc của nó.
8. **Mọi section đều phải responsive**: kiểm tra 1512, 1280, 1121, 1024, 768, 390, 360 — không tràn ngang, chữ không vỡ dòng xấu.

## 2. Font

**Montserrat** variable (trục `wght` 100–900, chỉ kiểu đứng), tự host trong `assets/fonts/montserrat/` (Google Fonts v31), 3 subset theo `unicode-range` trong `css/fonts.css`, **thứ tự bắt buộc latin-ext → vietnamese → latin** (như ritajuice.vn). Preload `montserrat-variable-latin.woff2`.

**Giãn chữ −2 % cho toàn bộ chữ**: khai báo `letter-spacing: var(--ls)` (`-0.02em`) trên `*`, `::before`, `::after` để mỗi phần tử tự tính theo cỡ chữ của chính nó (đặt ở `body` thì con sẽ kế thừa giá trị px của `body`, sai với chữ to / nhỏ).

| Vai trò | Token | Cỡ | Weight | Line-height | Ghi chú |
|---|---|---|---|---|---|
| Tiêu đề section (H2) | `--fs-h2` | 48 (≤ 1512 co về tối thiểu 30) | 900 | `--lh-h2` 120 % | `.section-title` in hoa; cỡ theo yêu cầu người dùng 2026-11-13, line-height 120 % người dùng sửa lại 2026-11-14 theo thiết kế (trước ghi 150 %), độ đậm Black đo trên thiết kế section danh mục |
| Tên thẻ danh mục | `--fs-card` | 24 (co về 16) | 700 | 120 % | in hoa |
| Số sản phẩm trên thẻ | `--fs-count` | 14 (≤ 680: 12) | 300 | 120 % | |
| Tiêu đề lớn nhiều dòng (`.display-title`) | `--fs-display` | 56 (co về 26) | 900 | `--lh-display` 127 % | in hoa; đo trên thiết kế section câu chuyện (dòng cách 71) |
| Số liệu (`.stat__value`) | `--fs-stat` | 64 (co về 40) | 700 | 120 % | |
| Nhãn số liệu (`.stat__label`) | `--fs-stat-label` | 16 | 700 | `--lh-stat-label` 140 % | in hoa, ngắt dòng cố định bằng `<br>` như thiết kế |
| Tên sản phẩm (`.product-card__title`) | `--fs-product` | 15 (≤ 680: 13) | 700 | `--lh-product` 160 % (≤ 680: 145 %) | in hoa. **Thiết kế dùng font Poppins** cho tên sản phẩm (chữ hẹp, cao hơn); giữ Montserrat theo quy định một font, chọn 15 px để vẫn vừa thẻ 241 px và xuống 2 dòng như thiết kế, cách dòng 24 đúng thiết kế |
| Chữ mô tả thông thường | `--fs-body` | 16 | 400 | `--lh-body` 120 % | theo yêu cầu người dùng; mặc định của `body` |
| Đoạn mô tả / nội dung (`.section-desc`, footer: giới thiệu, `dd`, link sản phẩm; liên hệ trong menu mobile) | `--fs-text` | 16, **≤ 680: 14** | 300 | theo khối | người dùng yêu cầu 2026-11-14 giảm mô tả ở mobile xuống 14; nhãn in đậm footer giữ 16 |
| Menu chính, nút CONTACT ở header | `--fs-nav` | 14 | 700 | 120 % | in hoa |
| Mục menu con (dropdown) | `--fs-sub` | 12 | 400 | 120 % | in hoa |
| Chữ nút | `--fs-button` | 16 | 700 | 120 % | in hoa (Bold 16 / 120 % / −2 % như bảng Typography người dùng gửi) |
| Nhãn cột footer | `--fs-body` | 16 | 700 | 120 % | in hoa, màu `--black` |
| Nội dung footer (địa chỉ, link, mô tả) | `--fs-body` | 16 | 300 | `--lh-text` 150 % | **thiết kế footer cách dòng 24 px** (đo trên ảnh), khác 120 % của chữ mô tả chung |
| Ô nhập / select | `--fs-input` | 14 | 400 | 120 % | placeholder `--placeholder` |
| Bản quyền cuối footer | `--fs-small` | 12 | 700 | 120 % | trắng trên `--ink` |

Cỡ chữ và độ đậm đo trực tiếp trên ảnh thiết kế (so bề rộng chữ và độ đậm nét với Montserrat render thử): menu 14 px Bold, nút / nhãn footer 16 px Bold, dropdown 12 px Regular, nội dung footer 16 px Light.

## 3. Màu

`--red` #d92b2b (đỏ Rita: nút chính, chấm CONTACT, gạch chân menu, hover chữ) / `--red-dark` #b81f22 (hover nút đỏ) · `--ink` #242424 (chữ, viền ô nhập, nút tối, thanh bản quyền) · `--black` #000 (nhãn cột footer) · `--white` · `--surface` #f4f4f4 (nền footer) · `--line` #c6cecc (viền ô Alibaba / QR) · `--line-soft` #e6e6e6 (kẻ dưới header mobile, kẻ mục menu mobile) · `--placeholder` #b4b8b6 · `--focus` #242424 (vòng focus) · `--hero-bg` #f9cd6b (màu chờ ảnh hero).

Tương tác: link chữ trên nền sáng hover → `--red`; mục menu chính hover / đang mở / đang xem → **gạch chân đỏ 1 px** (chữ giữ màu `--ink`, chevron không gạch); mục đang xem chỉ gạch khi không có mục nào khác đang hover / mở và không mở tìm kiếm (đúng các trạng thái trong thiết kế).

## 4. Breakpoint, container, khoảng cách

Desktop ≥ 1121 · Tablet ≤ 1120 (header mobile, menu dialog) · Mobile ≤ 680.

- **Hai loại container** (người dùng yêu cầu 2026-11-13):
  - `.container` mặc định cho nội dung các section: lề `--page-gutter` = 120 px ở 1512 (`clamp(16px, 7.937vw, 160px)`), nội dung tối đa `--container` 1440.
  - `.container.container--wide` **chỉ cho header và footer**, sát mép hơn: lề `--page-gutter-wide` = 40 px ở 1512 (`clamp(16px, 2.646vw, 48px)`), **không giới hạn bề rộng tối đa** (người dùng yêu cầu 2026-11-14 header / footer bằng khoảng cách nút ‹ › tới mép). **Nút ‹ › slider dùng cùng token** (`--slider-arrow-gap` = `--page-gutter-wide`) nên ở mọi bề rộng mép nút thẳng hàng logo / nút CONTACT / nội dung footer. Muốn đổi khoảng cách sát mép thì chỉ sửa `--page-gutter-wide`. (Đã thử neo header / footer theo container body cho bớt cách xa nội dung ở màn rộng — người dùng không muốn, đã trả lại.)
  - ≤ 1120 cả hai lề = `clamp(16px, 3.125vw, 32px)`.
- `main` chừa `--hd-h` (90) phía trên; trang có hero / banner nằm dưới header thì thêm `.site-header--overlay` vào header để `main` không chừa (`.site-header--overlay ~ main`). ≤ 1120 `main` luôn chừa `--hd-mobile-h` + 1 px.

## 5. Component

### Nút — `.button`
Cấu trúc: ô mũi tên vuông + khe 3 px + ô chữ (thiết kế "→ | CONTACT US"):
```html
<a class="button button--primary" href="./contact.html"><span class="button__icon" aria-hidden="true"></span><span class="button__text">Contact us</span></a>
```
- Cao `--btn-h` 50, ô mũi tên vuông bằng chiều cao (mũi tên `ic-arrow-right.svg` rộng 42 % ô), ô chữ rộng tối thiểu `--btn-min-w` 144, đệm ngang `--btn-pad` 21, chữ 16 Bold in hoa.
- **Responsive** (người dùng báo nút còn to ở mobile 2026-11-14) — chỉ đổi token trong `:root` theo breakpoint, không sửa component:

  | | `--btn-h` | `--btn-h-sm` | `--fs-button` | `--btn-min-w` | `--btn-pad` | `--btn-gap` |
  |---|---|---|---|---|---|---|
  | Desktop ≥ 1121 (thiết kế) | 50 | 44 | 16 | 144 | 21 | 3 |
  | Tablet ≤ 1120 | 46 | 42 | 15 | 128 | 18 | 3 |
  | Mobile ≤ 680 | 40 | 40 | 14 | 104 | 16 | 2 |
- Biến thể màu (đổi bằng biến `--btn-bg`, `--btn-bg-hover`, `--btn-fg`, `--btn-fg-hover`, `--btn-border`, `--btn-border-hover`):
  - `.button--primary` đỏ, hover `--red-dark`.
  - `.button--dark` nền `--ink`; **hover không đổi màu** (người dùng yêu cầu 2026-11-14), chỉ chạy hiệu ứng mũi tên.
  - `.button--outline` **dùng trên nền màu / ảnh** (người dùng yêu cầu 2026-11-13): nền trong suốt, viền trắng 1 px cả 2 ô, chữ / mũi tên trắng; hover đổ nền trắng, chữ / mũi tên đổi `--ink`.
  - `.button--line` **dùng trên nền sáng** (màn chào): nền trong suốt, viền `--ink` 1 px, chữ / mũi tên `--ink`; hover đổ nền trắng, giữ chữ đen — đồng bộ với `.button--outline` (người dùng yêu cầu 2026-11-14).
- Cỡ / kiểu: `.button--sm` (cao `--btn-h-sm` 44, dùng cho nút Submit của tìm kiếm); `.button--prev` lật mũi tên sang trái. Nút chỉ có icon (nút ‹ › hero) = `.button` chỉ chứa `.button__icon`.
- Hover: mũi tên chạy ra mép rồi vào lại từ phía đối diện (`arrow-loop`, chiều theo `--arrow-dir`).

### Header — `.site-header`
- Desktop: `position: fixed`, **cao `--hd-h` 90, trong suốt, cuộn trang không đổ nền** (người dùng yêu cầu 2026-11-13); nội dung cao 50 (`--box-h`) căn giữa theo chiều dọc (cách trên / dưới 20).
- **Logo trắng khi đi qua nền đỏ** (người dùng yêu cầu 2026-11-14): header trong suốt nên logo đỏ chìm vào section nền đỏ → section nền trùng màu logo thì thêm hook `logoLightJS` (hiện có: lớp đỏ `.stack-reveal__front` trang chủ). `LogoLightModule` (ON_DEMAND theo `.logoLightJS`) theo dõi cuộn (rAF): tâm logo nằm trong vùng có hook thì header thêm `.is-logo-light`; CSS (chỉ ≥ 1121 — ≤ 1120 header nền trắng) đổi ảnh logo thành trắng bằng `filter: contrast(0) brightness(2)` (mọi màu → xám 50 % → trắng; chuyển `--dur-base` đi qua hồng nhạt, không xỉn xám như `brightness(0) invert(1)`), không cần file logo trắng riêng.
- Hàng: logo `logo.svg` rộng `--logo-w` = `--header-side-w` **125** (người dùng yêu cầu 2026-11-14 logo và CONTACT cùng rộng 125 để hai bên cân nhau; thiết kế gốc logo 93) · hộp menu trắng `.primary-nav` (cao 50, đệm ngang và khoảng cách mục `--nav-pad` / `--nav-gap` 32 ở 1512, co về 20 ở màn nhỏ; **luôn nằm chính giữa trang**: `.site-header__inner` là lưới `1fr auto 1fr`, logo bám trái, CONTACT bám phải — người dùng yêu cầu 2026-11-14 vì logo 93 và CONTACT 125 rộng khác nhau, căn giữa khoảng trống giữa hai cái như thiết kế gốc làm menu lệch trái 16 px so với nội dung) · `.header-contact` (hộp trắng 50, chấm đỏ 12 px có vòng lan `dot-pulse`, chữ CONTACT 14 Bold, **rộng cố định `--header-side-w` 125**, đệm ngang 16, nội dung căn giữa; ≤ 1120 rộng tự động).
- Mục cha có chevron `ic-dropdown.svg` 11 × 6.5 cách chữ 8 (thiết kế không xoay chevron khi mở).
- **Dropdown** `.sub-menu`: tấm trắng **rộng đúng bằng hộp menu**, cách hộp 4 px (`--panel-gap`, có cầu nối `::before` để rê chuột qua khe không bị đóng), đệm 20 / 32, lưới **4 hàng × 32 px, xếp theo cột** (`grid-auto-flow: column`), mỗi cột rộng 245 → cao luôn 168 kể cả menu ít mục. Thứ tự trong HTML là thứ tự đọc theo cột của thiết kế (About: Story, Activities, Awards, Certificates | History, Brands; Products: 10 danh mục 3 cột; Services: OEM, ODM; Blog: RITA news, Beverage news, Tropical fruit, Beverage market).
- Mở menu con: rê chuột (chỉ khi chuột thật sự di chuyển, xem `js/pointer.js`), focus bàn phím, chạm lần 1 trên màn cảm ứng; đóng khi rời mục, Esc, click ngoài, cuộn trang (trừ khi focus đang ở trong).
- ≤ 1120: thanh trắng cao 60 kẻ dưới `--line-soft`; logo 80 · CONTACT (ẩn ≤ 680) · icon tìm kiếm · nút menu. Hộp menu desktop ẩn.

### Tìm kiếm — `form.header-search` (trong `.primary-nav`)
- Desktop: tấm trắng cùng vị trí / bề rộng với dropdown, đệm 32; form rộng `--search-w` 640 căn giữa: hàng 3 select chia đều **Choose category / Choose packaging / Choose volume** (cách 16; thiết kế gốc chỉ có 2 select rộng 550, người dùng thêm select danh mục 2026-11-14 nên form nới ra 640 để chữ "Choose packaging" không bị cắt) → ô **Search for products** cả hàng → nút Submit (`.button--primary.button--sm`) căn giữa. Ô cao 48, viền 1 px `--ink`, chevron `ic-dropdown.svg` cách phải 16; focus thì viền dày 2 px (outline lùi vào trong).
- **Mở bằng rê chuột vào icon kính lúp** (người dùng yêu cầu 2026-11-13), không chiếm focus; rời khỏi hộp menu + tấm tìm kiếm, rê sang mục menu khác hoặc cuộn trang thì đóng. Đã click / focus vào form (gõ chữ, chọn select) thì tấm **giữ nguyên**, chỉ đóng bằng Esc, click ra ngoài hoặc bấm lại icon. Bấm icon (chuột / bàn phím) = mở và focus ô tìm kiếm. Đang tìm kiếm thì menu con không bung khi rê chuột qua.
- ≤ 1120: tấm xổ xuống ngay dưới thanh header, full ngang; ≤ 680 các ô xếp 1 cột.
- Tham số: `s`, `product_cat` (slug danh mục như menu Products), `filter_packaging`, `filter_volume` (kiểu bộ lọc thuộc tính WooCommerce `pa_packaging`, `pa_volume`), ẩn `post_type=product`, `action` → `searching.html`. Danh sách bao bì / dung tích lấy từ form tìm kiếm của site rita.com.vn hiện tại. Tham số trên URL tự điền lại vào form.

### Menu mobile — `dialog.site-menu`
Như ritajuice.vn: dialog toàn màn trượt từ phải, menu "trượt từng tầng" (`MobileMenuModule`: bấm mục cha → nút Back + tiêu đề nhóm + link con), cuối panel có nút Contact us + email + số Sales. Mục cấp 1 18 Bold in hoa, link con 14 in hoa, kẻ `--line-soft`.

### Màn chào — `section.welcome-screen` (trang chủ)
Người dùng yêu cầu 2026-11-14 theo kiểu welcome-screen của ritadrink.com: **màn phủ toàn màn hình, hiện mỗi lần vào trang chủ** (không nhớ theo phiên), che cả header; cuộn / vuốt / phím xuống / Esc / bấm SCROLL DOWN thì rời đi.
- Cấu trúc (phần tử đầu tiên trong `body`, `role="dialog"` `aria-modal`):
  ```
  section.welcome-screen.welcomeScreenJS
    div.container.container--wide.welcome-screen__bar   ← logo .site-logo + .header-contact đúng vị trí header (cao --hd-h; ≤ 1120 --hd-mobile-h, Contact ẩn ≤ 680 như header)
    div.welcome-screen__head                            ← h2 tiêu đề, p mô tả, .button-group--start (Our story .button--line, Our products .button--dark)
    div.welcome-screen__stage                            ← container-type: size
      div.welcome-screen__lineup.product-lineup.productLineupJS
        svg.product-lineup__ribbon.wave-ribbon.waveRibbonJS
        img.product-lineup__item × 17
    button.scroll-cue.welcome-screen__cue.welcomeDismissJS
  ```
- Hiện ngay từ khung hình đầu: script nhỏ trong `<head>` (chỉ ở index.html) gắn `html.is-welcome`; CSS chỉ hiện màn chào khi có class này (không JS thì không có màn chào) + khoá cuộn `overflow: hidden` + `scrollbar-gutter: stable` (không xô trang khi mở khoá) + nền `html` `--surface` (khe thanh cuộn cùng màu). Sau 6 s mà `WelcomeScreenModule` chưa gắn `.is-ready` (lỗi tải JS) thì script tự gỡ để khỏi kẹt trang.
- `WelcomeScreenModule` (ON_DEMAND `.welcomeScreenJS`): `inert` mọi phần tử khác trong `body`, đưa trang về đầu (tắt `scrollRestoration`), focus màn chào. Rời đi khi: bánh xe xuống (chỉ khi cuộn dọc là chính — cuộn ngang để kéo hàng lon), vuốt lên ≥ 42 px, phím ↓ / PageDown / End / Space / Esc, bấm SCROLL DOWN. **Hiệu ứng rời** (người dùng yêu cầu 2026-11-14): (1) dải sóng chạy khuất — `.wave-ribbon.is-exiting` cho mask `.wave-ribbon__reveal` (`pathLength="1"`, `stroke-dasharray: 1 1`) chạy `stroke-dashoffset` 0 → −1 trong `--dur-slow`, dải đỏ lẫn chữ rút dần về bên phải; (2) sau 600 ms **tách đôi ở giữa**: nhân bản màn chào (`.welcome-screen--lower`, `inert`, `aria-hidden`, bỏ id, ảnh chuyển eager / sync để không hở), bản gốc `.is-split` cắt nửa trên (`clip-path: inset(0 0 50% 0)`), bản sao cắt nửa dưới; thêm `.is-open` → nửa trên `translate: 0 -50%`, nửa dưới `0 50%` (`--dur-welcome` 900 ms, `--ease-in-out`). Xong thì gỡ bản sao, ẩn màn chào, bỏ `is-welcome`, trả `inert`, phát `welcome:dismissed` (HeroModule chờ sự kiện này mới chạy thanh tiến trình slide). Đã thử bằng Chrome headless điều khiển qua DevTools: 0,3 s dải đang rút, 1,1 s hai nửa ở ±35 %, 3 s xong, trang cuộn bình thường.
- Kích thước: `--wu = min(100vw / 1512, 100svh / 950)` (≈ 1 px khung thiết kế, co theo chiều chật hơn) cho khoảng cách dọc. **Tiêu đề to hết bề ngang** (người dùng yêu cầu 2026-11-14): `.welcome-screen__head` là `container-type: inline-size`, `font-size: calc(100cqw / 16.6)` (đo: bề rộng chữ ≈ 16,43 × cỡ chữ với Montserrat Black + −2 %) → luôn vừa một dòng; ≤ 680 `100cqw / 8.5` → 2 dòng cân. Lề ngang `--page-gutter-wide` để thẳng logo. Mô tả Light 16 / 1.5, rộng tối đa 74em. Nền `--surface` („smoke").
- Hàng sản phẩm: khung `.welcome-screen__lineup` tỉ lệ 1512 : 570 nằm đáy, rộng `min(100cqh × 1512/570, max(100cqw, 75cqh × 1512/570))` — vừa chiều cao còn lại, ít nhất bằng màn hình hoặc 75 % chiều cao (màn hẹp cắt hai bên, giữ sản phẩm và chữ đủ to). 9 sản phẩm thiết kế ở giữa (cao theo % khung: kombucha 81.4, iced coffee 55.1, coco energy / aloe apple 67.7, aloe strawberry 80.9, ginger peach 74.9, cherry soda 50, ice tea 82.1, bird's nest 64.4) + **4 lon mỗi bên** (người dùng yêu cầu thêm lon 2026-11-14; chọn cho tổng bề rộng 2 bên gần bằng nhau để 9 sản phẩm giữa vẫn đúng chỗ). **Dải chữ nằm dưới tất cả lon** (người dùng yêu cầu 2026-11-14; bỏ kiểu đan lon trước / sau thiết kế).
- Nút SCROLL DOWN `.scroll-cue` (component dùng chung): hộp trắng cao `--box-h`, chữ 14 Bold có gạch chân đỏ như menu, chevron nhún `cue-nudge`; đáy giữa màn chào.

### Hàng sản phẩm kéo được — `.product-lineup` + `ProductLineupModule`
- Người dùng yêu cầu 2026-11-14 „các lon phải kéo được". Flex canh đáy, căn giữa, `column-gap: 1.57%` (24 / 1512), cao từng ảnh `--h` (% khung). JS nhân bản cả hàng thêm 2 bộ (trước / sau, `aria-hidden`, alt rỗng) → kéo (chuột / cảm ứng, `touch-action: none`, pointer capture) đổi biến `--x` trên khung, mọi ảnh `translate: var(--x)` — **không bọc track có transform** vì transform tạo stacking context, ảnh sẽ không chồng được với dải chữ. Lặp vô tận: `--x` quay vòng trong ±½ chiều dài một bộ (đo `offsetLeft` bộ gốc − bộ trước). Thả tay trôi theo quán tính (ma sát 0.92 / 16 ms), cuộn ngang trackpad cũng kéo được. Con trỏ grab / grabbing.

### Dải chữ sóng — `.wave-ribbon` + `WaveRibbonModule`
- SVG `viewBox` trùng khung (1512 × 570), `overflow: visible` để dải chạy ra hết mép màn hình; đường sóng `path#…` (nét đỏ 38) + `text > textPath`. Nội dung viết một lần trong HTML: „YOUR BRAND, OUR PRODUCTION × BEVERAGE INNOVATION ✱ OEM & ODM EXPERTISE → PRIVATE LABEL SOLUTIONS × FROM CONCEPT TO CREATION ✱ QUALITY YOU CAN TRUST → MADE FOR GLOBAL MARKETS × BUILDING BRANDS TOGETHER ✱" (người dùng gửi ảnh nội dung, không làm theo nền trắng của ảnh). Chữ trắng Bold 20, `dominant-baseline: central`.
- JS: nới khoảng cách quanh dấu ×, ✱, → thành 4 khoảng trắng không ngắt mỗi bên (người dùng yêu cầu 2026-11-14 „tăng gap cho thoải mái"); lặp nội dung đủ phủ đường + một nhịp, **chạy từ trái sang phải** (người dùng yêu cầu: `startOffset` tăng từ −nhịp về 0 rồi quay vòng) 60 đơn vị / s; chỉ chạy khi đang trên màn hình. Chỉ đo khi dải đã hiện và font đã tải, bỏ qua số đo vô lý và giới hạn 12 bản lặp — bản đầu đo lúc khung 0 × 0 nên nhân chuỗi hàng nghìn lần làm treo trang.

### Hero — `section.hero` (trang chủ)
- Swiper fade, `rewind`, tự chuyển sau `--hero-delay` 6 s theo thanh tiến trình `.slider-progress` (đỏ 3 px ở đáy, hook `sliderProgressJS`), kéo / bàn phím được.
- Desktop: cao `--hero-h` = `min(100svh, 59.524vw)` (đúng 900 ở khung 1512 × 900 của thiết kế), ảnh `cover` căn giữa → ở 1512 × 900 ảnh 1920 × 1009 phóng 0.892, cắt khoảng 100 px mỗi bên đúng như thiết kế. ≤ 1120: khung theo tỉ lệ ảnh 1920 : 1009, không cắt.
- Nút ‹ › (người dùng yêu cầu 2026-11-13) là component chung **`.slider-arrow`** dùng cho mọi slider: `.button.button--outline(.button--prev).slider-arrow.slider-arrow--prev|--next` chỉ có ô mũi tên, hook `sliderPrevJS` / `sliderNextJS` đặt trong phần tử gốc của slider (có `position: relative`). Cỡ `--slider-arrow` **40 px** (≤ 1120 `--slider-arrow-sm` 36; người dùng thấy 50 px to quá), giữa chiều cao slider, cách mép `--slider-arrow-gap` (mặc định = mép nội dung header / footer, xem mục 4; slider khác muốn đổi thì đặt lại biến trên phần tử gốc); ẩn khi Swiper chưa chạy / khi không đủ slide và ở ≤ 680 (vuốt). Header đè lên mép trên ảnh.
- 2 slide: `hero-01.webp` (banner thiết kế: lê – gừng nền vàng) và `hero-02.webp` (dưa leo nền xanh), cùng chiến dịch SIAL Paris / FHC Shanghai / PLMA Chicago 2026 trên site rita.com.vn. Banner thứ 3 của production (dưa hấu nền đỏ) **không dùng** vì logo đỏ trên nền đỏ gần như mất.

### Section chung — `.ss-pd`, `.section-head`
- `.ss-pd`: đệm trên / dưới `--pd-sc` (100 ở 1512, tối thiểu 56). `.container` mặc định (lề 120). `.bg-surface`: nền `--surface` cho section.
- `.section-head` (cách nội dung `--head-gap` 64): `h2.section-title` canh trái, Black 900 in hoa → `p.section-desc` Light 16, cách tiêu đề `--title-gap` 16, rộng tối đa `--desc-w` 57em (≈ 912 px, xuống dòng đúng như thiết kế). Line-height mô tả dùng `--lh-body` 120 % theo quy định của người dùng (ảnh thiết kế đo ra khoảng 140 %, nên lưới thẻ đứng cao hơn thiết kế khoảng 4 px).
- `.section-more`: hàng nút căn giữa dưới lưới, cách `--card-row-gap`.

### Lưới thẻ — `.card-grid` + `.media-card` (dùng chung; trang chủ: section danh mục ngay dưới hero)
- `ul.card-grid`: số cột theo biến `--cols` (mặc định 4; ≤ 1120: 3, ≤ 680: 2 — muốn lưới khác số cột thì đặt `style="--cols: 5"` hoặc modifier), cột cách `--card-gap` 24, hàng cách `--card-row-gap` 26 (ở 1512 thẻ rộng 300, bước hàng 271 đúng thiết kế).
- `a.media-card` căn giữa: `__media` (ảnh `cover`, tỉ lệ `--media-ratio` mặc định 900 : 555 = 300 × 185 ở 1512) → `__title` Bold in hoa `--fs-card` (24, co về 14 để tên dài như "Coconut products" vẫn 1 dòng ở mobile; cách ảnh 10) → `__meta` Light `--fs-count` (cách 4). Hover / focus: ảnh phóng 1.05, tiêu đề đổi `--red`.
- Trang chủ: `section.ss-pd.bg-surface` "Our beverage capabilities", ảnh `cate-*.webp`, `__meta` = "9 products" (số mẫu theo thiết kế). Link `product-category.html?category={slug}`, thứ tự 10 danh mục theo thiết kế (Fruit juice, Coconut products, Aloe vera drinks, Sparkling drinks, Milk drinks, Seed drinks, Coffee drinks, Energy drinks, Tea drinks, Special drinks).
- **Nút See more** (`.button--dark`) — `LoadMoreModule` (người dùng yêu cầu 2026-11-14): bọc `.loadMoreJS[data-rows="2"]`, lưới là `.loadMoreListJS`. Ban đầu chỉ hiện `data-rows` hàng (số thẻ = số cột thực tế × số hàng: PC 8, tablet 6, mobile 4; tính lại khi đổi cỡ màn), bấm nút thì **hiện hết phần còn lại một lần rồi ẩn nút**; thẻ mới hiện dần lần lượt (class trạng thái chung `.is-revealed`, keyframes `reveal-in`, cách nhau 80 ms), focus chuyển tới thẻ đầu tiên vừa hiện. `.section-more` có `hidden` sẵn trong HTML, JS chỉ hiện khi còn thẻ bị ẩn (không có JS thì thấy đủ 10 thẻ, không có nút chết). Thiết kế vẽ đủ 10 thẻ phía trên nút, nhưng site chỉ có 10 danh mục nên bản tĩnh ẩn trước 2 thẻ cuối để nút có tác dụng; muốn hiện nhiều hàng hơn thì đổi `data-rows`. Khi lên WP có nhiều danh mục hơn vẫn dùng nguyên cơ chế này.

### Thẻ sản phẩm — `.product-card` + lưới `.card-grid--5` (dùng chung cho mọi danh sách sản phẩm)
- `ul.card-grid.card-grid--5`: 5 cột (≤ 1120: 4, ≤ 680: 2), cột cách `--product-gap` 16, hàng cách `--product-row-gap` 35 (ở 1512 thẻ 241, bước hàng 340.5 đúng thiết kế). Nút `.section-more` ngay sau lưới này cách `--product-more-gap` 43.
- `a.product-card`: `__media` khung vuông nền trắng, ảnh `contain` có đệm `--product-pad` 8.5 % (ảnh lon nguồn cao 92 % khung → còn 76 % như thiết kế) → `__title` Bold in hoa canh trái, cách ảnh 16. Hover / focus: ảnh phóng 1.05, tên đổi `--red` (thẻ đầu trong thiết kế là trạng thái hover). Link `product-detail.html`.

### Thanh lọc một hàng — `form.search-bar.search-bar--inline` (dùng lại component `.search-bar` của ô tìm kiếm header)
- Cùng ô / tên trường với tìm kiếm header: `product_cat` (Choose category — người dùng yêu cầu thêm 2026-11-14), `filter_packaging`, `filter_volume`, `s`, ẩn `post_type=product`, `action` → `searching.html`; nút `.button--primary` "Search".
- Desktop một hàng: 3 select + ô tìm kiếm + nút **chia đều 5 cột** (`repeat(5, 1fr)`, người dùng yêu cầu 2026-11-14), cách 16 → ở 1512 mỗi ô 241.6, thẳng cột với thẻ sản phẩm bên dưới; ô cao = `--btn-h` (50, co theo nút); nút giãn hết ô (`.button__text` flex 1). Thiết kế gốc chỉ có 2 select (240 + 240 + ô 499 + nút 245). Cách lưới bên dưới `--filter-gap` 24.
- ≤ 1120: hàng 1 là 3 select, hàng 2 ô tìm kiếm (2/3) + nút (1/3); ≤ 680: xếp dọc, nút rộng hết hàng.

### Bộ lọc thu gọn — `.filter` (bọc ngoài `.search-bar--inline`, dùng chung)
- Người dùng yêu cầu 2026-11-14: **desktop** thanh lọc hiện nguyên một hàng; **≤ 1120** thu thành một nút đỏ `.button--primary.filter__toggle` **rộng hết hàng** (ô chữ giãn, ô icon vuông) với icon phễu `ic-filter.svg` (`.button__icon--filter`, không chạy hiệu ứng mũi tên) và lời kêu gọi **"Find your perfect drink"**; bấm thì xổ tấm lọc `.filter__panel` (tuyệt đối dưới nút cách 8, nền trắng, viền `--line-soft`, đệm `--filter-pad` 20, `panel-in`) đè lên lưới; bên trong giữ bố cục tablet / mobile của `.search-bar--inline`.
- `FilterModule` (hook `.filterJS` / `.filterToggleJS`, `aria-controls` = id của form): bật / tắt `.is-open` + `aria-expanded`, mở thì focus ô đầu tiên, đóng khi bấm lại nút, bấm ra ngoài, Esc (Esc trả focus về nút). Module thêm `.is-enhanced` khi chạy — CSS chỉ thu gọn khi có class này, nên không có JS vẫn thấy đủ ô lọc.

### Section New releases (trang chủ, sau section danh mục)
- `section.ss-pd.bg-surface` + `.section-head.section-head--center` (tiêu đề / mô tả căn giữa) → thanh lọc → 20 thẻ sản phẩm → nút **See more** `a.button.button--dark` **đi link `products.html`** (không tải thêm). Section danh mục phía trên thêm `.pdb-0` vì hai section liền nhau cùng nền.
- 20 sản phẩm mẫu, ảnh `product-*.webp` (xem mục 7), 4 thẻ đầu đúng 4 lon trong thiết kế (Peach, Soursop, Pineapple, Orange); tên viết theo chữ trên lon.

### Ghim và phủ — `.stack-reveal` + lon xoay `.can-spin` (trang chủ, sau New releases)
Người dùng yêu cầu 2026-11-14 dựa theo project `C:\Harry\can-spin-3d`: lon xoay theo cuộn, section đỏ trượt lên che section trên — **xoay và trượt cùng lúc** (người dùng bỏ đoạn ghim đứng yên cho lon xoay hết vòng rồi mới trượt), **lon xoay luôn trong lúc chữ chạy vào** (nhãn in cả mặt sau để lúc nào cũng thấy chữ đỏ xoay qua) và **có bóng đổ dưới đáy** cho cảm giác lon đứng trên nền đỏ.
- Cấu trúc (component dùng chung, không gắn với trang):
  ```
  section.stack-reveal.stackRevealJS
    div.stack-reveal__back.bg-factory        ← lớp sau, sticky top 0, cao đúng tới mép dải đỏ (--stack-top)
      h2.display-title.stackAnchorJS          ← mốc để đặt lon
    div.stack-reveal__front.bg-red.logoLightJS ← lớp trước, cuộn bình thường, z-index trên lớp sau; logo header đổi trắng khi đi qua
      div.stack-reveal__float.can-spin         ← khung nổi vắt ngang mép đỏ (vị trí, cao --float-h) + bóng đổ ::after
        canvas.can-spin__canvas.canSpinJS.stackFloatJS
      div.container.stack-reveal__body        ← mô tả, số liệu, nút
  ```
- Diễn biến khi cuộn: (1) section cuộn vào: các dòng tiêu đề chạy vào, lon xoay theo cuộn cùng lúc (cùng tốc độ với lúc trượt); lớp sau chạm đỉnh màn hình thì ghim — lúc này chữ vừa đứng đúng chỗ, lon vừa quay về chính diện, bố cục đúng thiết kế (tiêu đề, lon vắt ngang mép, dải đỏ phía dưới). (2) Cuộn tiếp: lớp đỏ trượt lên che lớp sau, lon đi theo lớp đỏ **và xoay tiếp đúng 1 vòng trong lúc trượt** (tiến độ 0 lúc ghim → 1 khi mép đỏ chạm đỉnh màn hình; cuộn ngược thì xoay ngược), dừng lại ở chính diện. (3) Lớp đỏ cao hơn lớp sau nên lúc lớp sau thôi ghim nó đã bị che kín (đã đo ở 1920 × 919: lớp sau −1, lớp đỏ −275 → 614).
- `StackRevealModule`: đọc `--float-w` (bề rộng lon mong muốn `clamp(160px, 18.04vw, 420px)` = 273 ở 1512 như thiết kế; ≤ 680 `clamp(160px, 44vw, 240px)` cho lon to trên mobile), `--float-overlap` (lon chồng lên dòng cuối tiêu đề 30 ở 1512), `--float-rise` (.378 = phần lon thò lên trên mép đỏ, đo trên thiết kế) — ba token này khai báo `@property` để JS đọc được giá trị px; đo đáy tiêu đề (`.stackAnchorJS`) rồi đặt `--float-h` (chiều cao lon) và `--stack-top` (mép đỏ) lên phần tử gốc. **Cỡ lon** (người dùng yêu cầu lon to hơn 2026-11-14): lấy đúng tỉ lệ thiết kế, chỉ thu nhỏ khi lúc ghim phần đáy lon khuất dưới mép màn hình quá 20 % (`FLOAT_MAX_HIDDEN`); tối thiểu 240. Kết quả: 1512 × 900 → 612 (= thiết kế, khuất ~12 % đáy), 1920 × 919 → 663, 390 × 844 → 385 (thấy trọn). Bản trước ép lon vừa trọn màn hình nên chỉ 478 / 494 — người dùng thấy nhỏ. Tính lại khi đổi bề ngang / đổi hẳn chiều cao (bỏ qua thanh địa chỉ mobile ẩn hiện) và khi tiêu đề đổi cỡ (ResizeObserver). Tiến độ = (--stack-top − mép trên lớp đỏ) / --stack-top: 0 lúc ghim → 1 khi mép đỏ chạm đỉnh màn hình; trước lúc ghim là số âm, chặn ở −innerHeight / --stack-top (section vừa chạm đáy màn hình, lon còn khuất) để lon xoay đều tay suốt lúc chữ chạy vào; phát sự kiện `stack:progress` trên phần tử gốc (lưu ở `root.stackProgress`).
- **Chữ lớn chạy theo cuộn** (người dùng yêu cầu 2026-11-14 „text lớn chạy ra"): mỗi dòng `.stackLineJS[data-run="1|-1"]` (1 = chạy trái → phải, −1 = phải → trái; dòng 1, 3 là 1, dòng 2, 4 là −1). Khi section cuộn vào (từ lúc lớp sau chạm đáy màn hình tới lúc ghim) các dòng chạy vào từ một bên (lệch nhịp 0.08, easeOut, quãng 120 % bề rộng dòng), **chỉ chạy một lần**: tới lúc ghim đứng đúng chỗ thiết kế và giữ nguyên khi cuộn tiếp (người dùng bỏ phần chữ chạy ra trong lúc lon xoay 2026-11-14); cuộn ngược lên quá điểm ghim mới chạy trả ra. Đặt bằng `style.translate` (%). Không có JS thì các dòng đứng yên.
- `CanSpinModule` (lấy từ `can-spin-3d/can-spin.js`, bỏ phần kéo tay / tự quay): canvas 514 × 1154 vẽ `can-base.webp` (lon trơn) rồi dán từng cột chữ của `can-label.webp` (nhãn "Your SIZE mL" trải phẳng 360°) lên thân lon theo độ cong khối trụ, `multiply` để chữ ăn sáng tối, `destination-in` để chữ không lem. Góc = `start` (0.1 rad: cụm chữ "Your SIZE mL" **ở chính diện, thấy trọn chữ** — người dùng yêu cầu 2026-11-14; trong thiết kế để lấp ló chỉ để gợi ý lon xoay được) + tiến độ × `turns` (1 vòng mỗi đơn vị tiến độ) → lúc ghim (0) và lúc mép đỏ chạm đỉnh (1) đều ở chính diện; lúc chữ chạy vào tiến độ âm nên lon xoay sẵn từ trước (~1,5 vòng ở 1920 × 919). **Nhãn lặp mặt sau** (`copies` 2, người dùng yêu cầu 2026-11-14: mặt sau trơn quá, lúc chữ tiêu đề chạy vào phải thấy chữ đỏ trên lon xoay qua): nhãn gốc chỉ in cụm chữ ở một mặt (~28 % vòng lon) → lúc tải ảnh ghép thêm một bản lệch nửa vòng (`multiply`), góc nào cũng thấy chữ đỏ. **Bóng đổ dưới đáy** (người dùng yêu cầu 2026-11-14 „tạo cảm giác đặt để lon"): `.can-spin::after` — elip `radial-gradient` đen .55 → trong suốt, rộng 110 % lon, tỉ lệ 5 : 1, tâm ở chỗ đáy lon chạm sàn (y 1120 / 1154 trên ảnh; `margin-top: -17.6%` = −(34 / 514 + 11 %) bề rộng lon); canvas `position: relative` để vẽ đè lên bóng. Đã thử vẽ bóng trong canvas nhưng ảnh chỉ còn 27 px trống dưới đáy nên bóng quá mỏng, không thấy. Thông số ảnh (tâm 256.5, bán kính 219.5, vùng nhãn 127–1063) ghi đè được bằng `data-cx`, `data-r`, `data-y0`, `data-y1`, `data-start`, `data-turns`, `data-copies`. Trước khi vẽ, canvas hiện sẵn ảnh lon trơn làm nền (bỏ khi `.is-ready`). Không tắt theo „giảm chuyển động" (quy tắc kế thừa ritajuice.vn).
- Lớp sau `.bg-factory`: nền `--surface` + nét vẽ nhà máy `bg-factory.png`; tiêu đề `.display-title` 4 dòng (`__line`, `--end` canh phải, `--accent` đỏ; ≤ 680 tất cả canh trái và tự xuống dòng), cách đỉnh `--stack-head-top` (`clamp(100px, 12svh, 199px)` — hạ từ 16svh để lon to có thêm chỗ; 199 như thiết kế khi màn đủ cao). Dòng canh trái theo `.container` (lề 120) — thiết kế để lệch trái 44 px so với các section khác, đã canh lại cho thẳng hàng.
- Lớp trước `.bg-red` (nền đỏ trơn như thiết kế): chữ trắng; đệm trên = phần lon nằm trong lớp đỏ + `--float-gap` 64; nội dung `.stack-reveal__body` (lưới, cách `--stack-block-gap` 32): `p.section-desc.section-desc--center` (rộng tối đa 60em, Light 16 / 120 %, mobile 14) → `dl.stat-list` (4 `div.stat` > `dt.stat__label` + `dd.stat__value`, hiển thị số trên nhãn bằng `column-reverse`; flex căn giữa cách `--stat-gap` 96; ≤ 680 lưới 2 × 2) → `div.button-group` (Our story `.button--outline` → `our-story.html`, Our products `.button--dark` → `products.html`). Đệm dưới `--pd-sc`.
- **Số liệu chạy tăng** (người dùng yêu cầu 2026-11-14 „scroll tới rồi tăng, once"): hook `countUpJS` trên phần tử chứa số (ở đây 4 `dd.stat__value`) → `CountUpModule` (ON_DEMAND) đọc số viết trong HTML (giữ chữ trước / sau số như `+`, `%`; hiểu dấu phẩy nghìn và số lẻ), đặt về 0, khi phần tử vào tới 85 % chiều cao màn hình (IntersectionObserver, `rootMargin` đáy −15 %) thì chạy lên số cuối trong 1.8 s (easeOut bậc 3) rồi thôi theo dõi — **chỉ chạy một lần**. Lúc chạy khoá `min-width` (em) bằng bề rộng số cuối để hàng số liệu không xô, chạy xong gỡ. Montserrat mặc định là số proportional (`1` hẹp gần nửa `0`) — không dùng `tabular-nums` vì làm `1200+` rộng thêm 29 px, khác thiết kế. Không có JS thì hiện sẵn số cuối.
- **Lưới nền** `bg-grid.webp` (nét lưới trắng mờ dần xuống dưới, nền trong suốt) + utility `.bg-grid`: dùng cho section Services (nền tối), không dùng ở đây. Utility vẽ ảnh bằng `::before` **opacity .3** như thiết kế (người dùng yêu cầu 2026-11-14; giữ nguyên file ảnh), `position: relative` + `isolation` — phần tử dùng nó mà cần `position` khác (vd. sticky) thì rule của nó phải đứng sau `.bg-grid` trong CSS.

### Thẻ chồng cuộn rơi — `section.deck-section` + `.card-deck` (trang chủ: Services, sau section đỏ)
Người dùng yêu cầu 2026-11-14 tham chiếu „Recent werk" của extrafazant.nl (đã xem bằng Chrome headless: section ghim, thẻ khung màu xếp chồng, cuộn thì thẻ đầu rơi xuống dưới nút rồi khuất, thẻ sau tiến lên).
- Cấu trúc: `section.deck-section.bg-ink.cardDeckJS[style="--cards: 2"]` > `div.deck-section__pin.bg-grid` (sticky top 0, cao `100svh`; **nền lưới đặt ở đây chứ không ở section** để nền đứng yên lúc ghim — người dùng yêu cầu) > `div.container.deck-section__inner` (tiêu đề + mô tả `.section-head--center`, `ul.card-deck`, `.deck-section__more` nút Contact us) + `div.spin-badge.deck-section__badge`.
- Chiều cao section `100svh + (--cards − 1) × 70svh`, `overflow: clip` (không phá sticky) → thẻ rơi bị cắt ở đáy section, **nằm dưới nút (z-index 20) và dưới section sau** như người dùng yêu cầu. **Chỉ 2 thẻ: OEM, ODM** (người dùng yêu cầu), mỗi thẻ là link sang `oem-service.html` / `odm-service.html`.
- **Lúc ghim phải thấy đủ nội dung trên một màn hình PC** (người dùng yêu cầu): đệm khung ghim `max(--hd-h + 16, min(--pd-sc, 9svh))` trên, `min(--pd-sc, 9svh)` dưới (`--head-gap: 0`, khoảng cách lưới `clamp(24px, 3.5svh, 40px)`); bề rộng thẻ `min(62.83vw, (100svh − 500px) × 2.238)` (≥ 240; ≤ 680 `min(100%, (100svh − 440px) × 2.238)`). Đã đo bằng Chrome headless: 1920 × 937 thẻ 978, 1536 × 730 → 515, 1366 × 657 → 351, 1280 × 600 → 240, tiêu đề luôn dưới header, nút luôn trong màn hình.
- `.card-deck` lưới 1 ô, mọi `.card-deck__card` (`--i` 0…n) chồng cùng ô, `z-index: 10 − --i`; vị trí `--k` (0 = trước): `translate: 0 calc(--deck-step × −k + --drop)`, `scale: 1 − .053 × k`, gốc biến đổi mép trên (thẻ sau hẹp hơn 5,3 % và nhô lên `--deck-step` 45 ở 1512 như thiết kế). Không JS: `--k` = `--i` (chồng tĩnh).
- `CardDeckModule` (ON_DEMAND `.cardDeckJS`): tiến độ = phần đã cuộn trong đoạn ghim × (n − 1); thẻ i rơi khi tiến độ đi từ i → i + 1 (`--drop` = tiến độ² × khoảng từ đỉnh bộ thẻ tới đáy màn hình — rơi nhanh dần), các thẻ sau `--k = i − tiến độ` tiến lên cùng lúc; đặt `--spin` = scrollY × 0.2° cho huy hiệu.
- `.photo-card` (component dùng chung): link khung trắng đệm `clamp(10px, 1.587vw, 24px)`, ảnh `aspect-ratio: 902 / 403` cover, lớp gradient đen 50 % → trong suốt dưới đáy để chữ đọc rõ; **tiêu đề là `h3`** (người dùng yêu cầu: cỡ theo quy ước heading — `--fs-h3`), Black in hoa, căn giữa, cách đáy `5.5cqw` (thẻ là `container-type: inline-size`). Ảnh: `service-oem.webp` = `oem-front.jpg` (lon bạc trơn), `service-odm.webp` = `odm-front.jpg` (lon „YOUR BRAND") — bản 1110 × 698 của beveragevietnam.com (người dùng chỉ chỗ lấy). Thiết kế đặt ảnh „YOUR BRAND" cho thẻ OEM; đang ghép theo tên file, đổi lại nếu người dùng muốn.
- `.spin-badge` (huy hiệu tròn „THIS IS HOW / WE SCROLL", người dùng gửi ảnh mẫu): hình tròn đỏ `--badge` `clamp(96px, 9.921vw, 150px)`, SVG `viewBox 100` — một đường tròn bán kính 32 chạy theo chiều kim đồng hồ, **2 cụm chữ đối nhau** ở 25 % và 75 % chu vi (`text-anchor: middle`, mỗi cụm ép `textLength` 84 ≈ 150°), cụm dưới tự lộn ngược, **không thêm dấu chấm**; Black 15 in hoa trắng; cả vòng chữ `rotate: var(--spin)` xoay theo cuộn; giữa là `can-front.webp` (lon „Your SIZE" chính diện vẽ sẵn bằng script từ `can-base` + `can-label`, 79 × 200), cao `--badge × .42` — không dùng `%` vì hàng lưới sẽ giãn theo cỡ gốc 200 px của ảnh làm lon lệch xuống (người dùng thấy lon không ở giữa). Góc dưới phải khung ghim.

### Lý do chọn — `.feature-split` + `.feature-card` + `.dot-link` (trang chủ: Why choose us, sau Services)
- Lưới 3 cột `1fr auto 1fr`: 3 `li.feature-card` trái, lon giữa, 3 thẻ phải; ≤ 1120 lon lên đầu, thẻ 2 cột; ≤ 680 1 cột.
- `.feature-card`: nền trắng, cao tối thiểu `clamp(110px, 8.33vw, 126px)`, icon 64 (`ic-free-sample`, `ic-label-design`, `ic-moq`, `ic-rnd`, `ic-oem-odm`, `ic-fast-delivery` .png 128 × 128 người dùng gửi trong Downloads), tiêu đề `h3` in hoa (cỡ theo `--fs-h3`; „(1x20ft)" giữ chữ thường bằng `.feature-card__note`), mô tả Light 16 / 1.5.
- Lon giữa: `.can-spin` (có bóng sàn) + canvas `CanSpinModule` **đứng yên chính diện** (người dùng yêu cầu không xoay) — không nằm trong `.stackRevealJS` nên chỉ vẽ một lần ở góc `start`; cao `clamp(280px, 30.16vw, 456px)` (≤ 1120: 300, ≤ 680: 240).
- `.dot-link` (component dùng chung): hộp trắng cao `--box-h`, chữ in hoa Bold, chấm tròn 12 px (`--dot-color`, mặc định `--red`; `.dot-link--blue` `--blue`); **viền `--ink` chỉ hiện khi hover / focus** (người dùng nhắc: viền trong ảnh thiết kế là trạng thái hover, không phải viền cố định). Our formats / Our labels **mở popup** (`.popupOpenJS` + `aria-controls`), `href` (`products.html` / `oem-service.html`) chỉ là dự phòng khi không có JS.

### Popup — `dialog.popup` + `PopupModule` (Our formats / Our labels ở Why choose us)
Người dùng gửi thiết kế 2026-11-14.
- `dialog.popup.popupJS` (component dùng chung): mở bằng `showModal()` (khoá focus, Esc đóng — native), đóng thêm bằng nút `.close-button.popup__close.popupCloseJS` và bấm ra ngoài khung; rộng `min(100% − 32px, 1393px)`, căn giữa, nền `--surface`, đệm `clamp(24px, 3.968vw, 60px)`, cao tối đa màn hình (cuộn trong). **Nền mờ đen 55 %**: ảnh mẫu đặt popup trên hero vàng không phủ mờ, nhưng nút nằm ở section Why nền xám trùng màu khung popup nên phải phủ để tách. `body:has(.popup[open])` khoá cuộn trang.
- Formats — `.format-viewer.formatViewerJS`: trái ảnh lớn `.format-viewer__stage` (vuông trắng, `.icon-button` trái / phải 36 viền `--ink`, hover đổ `--ink`) + 4 ảnh nhỏ `role="tab"` (viền `--ink` khi chọn / hover); phải mỗi bao bì một `role="tabpanel"`: tiêu đề `h3` in hoa Black (cỡ theo quy ước `--fs-h3`; thiết kế ~32), mô tả, `ul.spec-list` 2 cột `.spec` (ô icon trắng 50, icon `ic-spec-{material,capacity,customize,application}.png` người dùng gửi, nhãn Bold 16, giá trị Light 13); đáy là `.cta-box` (nền `--ink`, tiêu đề `h3` in hoa, chữ Light 16, nút Contact us). `FormatViewerModule`: bấm ảnh nhỏ / nút trái phải / phím mũi tên → đổi cả ảnh lớn lẫn thông số. 4 bao bì: lon nhôm (nội dung theo thiết kế) + chai thuỷ tinh, PET, PP (**nội dung tạm** viết theo dung tích bao bì của ritajuice.vn: thuỷ tinh 250–490 ml, PET 320–1500 ml, PP 250–2000 ml — cần người dùng duyệt). Ảnh `format-{can,glass,pet,pp}.webp` = `Customize_*.png` của beveragevietnam.com (nhỏ, cao 221–271).
- Labels — `ul.label-grid` 3 cột `.label-card` (ô ảnh trắng 404 : 438, tiêu đề `h3`, mô tả Light 16): Glossy, Matte, Direct Printing — ảnh `label-*.webp` (beveragevietnam.com, cao 412).
- Ảnh trong các ô có `aspect-ratio` (ảnh lớn, ảnh nhỏ, thẻ Labels) đặt `position: absolute` + `object-fit: contain` — để trong luồng thì chiều cao gốc của ảnh kéo giãn ô (ô chai thuỷ tinh từng cao hơn các ô khác). ≤ 1120: ảnh lên trên, chữ xuống dưới; ≤ 680: thông số và thẻ Labels 1 cột, CTA xếp dọc.
- Quy ước heading: `h2` `--fs-h2` clamp(30–48) / 1.2; **`h3` `--fs-h3` clamp(20px, 1.587vw, 24px) / 1.2** (người dùng yêu cầu 24 theo quy ước, thêm 2026-11-14).

### Footer — `.site-footer`
- Nền `--surface`, `.container--wide`, đệm trên 120 / dưới 58; lưới 4 cột tỉ lệ `353.5fr 263.5fr 203fr 452fr`, cách 40 (ở 1512 các cột bắt đầu đúng vị trí thiết kế).
- Cột 1: logo rộng `--ft-logo-w` = `--header-side-w` **125** (người dùng yêu cầu 2026-11-14 bằng logo header; thiết kế gốc 155), lùi xuống 10 px như thiết kế → đoạn giới thiệu (Light 16 / 24, rộng tối đa 336 để xuống dòng như thiết kế) cách 40 → ô Alibaba (link gian hàng) + ô QR 107 × 107, viền `--line`, cách 32.
- Cột 2 + 3: `dl.footer-facts` > `div.footer-fact` (`dt` nhãn Bold in hoa đen, `dd` nội dung Light), nhãn cách nội dung 16, các nhóm cách 32. Địa chỉ link Google Maps, điện thoại `tel:`, email `mailto:`, Fax / MST chữ thường. Mạng xã hội: 6 icon 24 × 24 (`ic-*.svg` nền trắng sẵn), cách 8, hover nhích lên 2 px.
- Cột 4: `nav` + `h2.footer-title` "Products" + `ul.footer-links` 2 cột × 5 hàng **xếp theo cột** (thứ tự như thiết kế, khác thứ tự menu header), link Light 16 / 24 cách 12.
- Thanh cuối: nền `--ink`, chữ 12 Bold trắng căn giữa, đệm 10 (cao 34).
- ≤ 1120: 2 cột; ≤ 680: 1 cột.

## 6. Trang và link

| File | Ghi chú |
|---|---|
| `index.html` | Header + hero + footer |
| `our-story`, `our-activities`, `our-awards`, `our-certificates`, `our-history`, `our-brands` | rỗng — About us |
| `products`, `product-category`, `product-detail`, `searching` | rỗng — danh mục `product-category.html?category={slug}` |
| `oem-service`, `odm-service` | rỗng — Services |
| `blog`, `blog-detail` | rỗng — danh mục `blog.html?category={slug}` |
| `contact` | rỗng — nút CONTACT ở header, Contact us ở menu mobile |

- Slug danh mục sản phẩm: `fruit-juice`, `aloe-vera-drinks`, `coconut-products`, `sparkling-drinks`, `milk-drinks`, `seed-drinks`, `energy-drinks`, `coffee-drinks`, `tea-drinks`, `special-drinks`.
- Slug danh mục blog: `rita-news`, `beverage-news`, `tropical-fruit`, `beverage-market`.
- Ngoài: RITA on Alibaba `https://vn105660124.trustpass.alibaba.com/`; Facebook `beveragevietnam`, YouTube `c/RitaBeverage`, TikTok `@ritabeverage`, LinkedIn `rita-food-drink-co-ltd`, Pinterest `ritafooddrink`, X `ritavietnam` (giống các site Rita khác); Google Maps `https://maps.app.goo.gl/1k4urKnhR8r7mSMo9` (link ritajuice.vn).

## 7. Tài nguyên

- **Thư viện** (`assets/library`, chép từ ritajuice.vn): Swiper (chỉ trang có slider, `defer`), SmoothScroll (mọi trang, `defer`), Fancybox (không có thẻ nào trong trang: `js/fancybox.js` nạp ở lần bấm đầu tiên vào `[data-fancybox]`, qua `LightboxModule`).
- **JS**: `js/main.js` gồm nhóm module dùng chung (Header, HeaderSearch, SiteMenu, MobileMenu) và bảng `ON_DEMAND` `[selector, import]` chỉ nạp khi trang có phần tử khớp (`.heroJS` → HeroModule, `.loadMoreJS` → LoadMoreModule, `.filterJS` → FilterModule, `.stackRevealJS` → StackRevealModule, `.canSpinJS` → CanSpinModule, `.logoLightJS` → LogoLightModule, `.countUpJS` → CountUpModule, `.welcomeScreenJS` → WelcomeScreenModule, `.waveRibbonJS` → WaveRibbonModule, `.productLineupJS` → ProductLineupModule, `.cardDeckJS` → CardDeckModule, `.popupJS` → PopupModule, `.formatViewerJS` → FormatViewerModule, `[data-fancybox]` → LightboxModule). Thêm module cho trang mới thì thêm một dòng vào bảng. `js/pointer.js`: theo dõi chuột có thật sự di chuyển (dùng chung cho menu và tìm kiếm).
- **Ảnh**:
  - `cutout-*.webp` (hàng sản phẩm màn chào, nền trong suốt): 12 ảnh người dùng gửi 2026-11-14 (`Downloads/release-{2…15}.png`) → cắt sát viền trong suốt, cao tối đa 1000, WebP q88 (31–67 KB): kombucha, iced-coffee, coco-energy, aloe-apple, aloe-strawberry, ginger-peach-tea, cherry-soda, ice-tea, bird-nest-pear, ginger-bottle, beauty-collagen, coco-blueberry; 5 lon thêm lấy từ ritajuice.vn `award-can-*.webp` (cao 600): purple-juice, popping-boba, protein-milkshake, strawberry-soda, kombucha-peach. Bản đầu dùng `range-*.webp` của ritajuice.vn (chỉ ~100 × 256, bị mờ) đã thay hết.
  - `can-label.webp`: nhãn gốc `C:\Harry\can-spin-3d\assets\label-text.webp`, **chữ „Your" vẽ lại bằng Dancing Script 700** (người dùng thấy chữ script gốc mảnh khó đọc, Segoe Script thì xấu; font tải từ Google Fonts — OFL, chỉ dùng để vẽ vào ảnh, không nhúng web), cùng màu đỏ (217, 31, 39), xoay dọc đọc từ dưới lên như „SIZE", lưu WebP lossless.
  - `cate-{fruit-juice, coconut, aloe-vera, sparkling, milk, seed, coffee, energy, tea, special}.webp` 900 × 555: ảnh người dùng gửi 2026-11-13 (PNG trong Downloads). Dùng ở section danh mục trang chủ.
  - `hero-01.webp`, `hero-02.webp` (1920 × 1009) + bản `-768`, `-1280` cho `srcset`: banner `Baner_web_Ria_Paris_26_3.jpg` / `_1.jpg` của rita.com.vn.
  - **Giảm dung lượng** (người dùng yêu cầu 2026-11-14 „giảm byte hết mức, tránh điểm PageSpeed thấp"): toàn bộ ảnh nền đặc (hero, cate, product — 36 file) đổi từ JPG sang **WebP q80**: 2 970 KB → 1 291 KB (−57 %), JPG cũ đã xoá (bản gốc còn ở Downloads / dự án cũ / production). Ảnh lon màn chào nén lại từ file gốc q82 (745 → 611 KB) + bản nửa kích thước `cutout-*-sm.webp` q80 (8–21 KB) qua `srcset` / `sizes="(max-width: 680px) 120px, 12vw"` — màn DPR 1 và nhiều máy chỉ tải bản nhỏ.
  - `logo.svg` (= `logo-header.svg` của ritajuice.vn, dùng cho header, menu mobile, footer), `favicon.jpg`, `ic-search.svg`, `ic-dropdown.svg`, `ic-close.svg`, `ic-next.svg`, `ic-prev.svg`: từ ritajuice.vn.
  - `alibaba.png`, `qr.png`, `ic-facebook.svg`, `ic-youtube.svg`, `ic-tiktok.svg`, `ic-linkedin.svg` (đổi tên từ `ic-linked.svg`), `ic-pinterest.svg`, `ic-x.svg`: từ juice9vn.com (khớp ảnh thiết kế footer).
  - `product-*.webp` (20 ảnh lon nền trắng, 392–492 px): chép từ ảnh `product-N.jpg` của các dự án khác (người dùng gợi ý 2026-11-14), đổi tên theo sản phẩm: `product-natural-{peach, soursop}` ← ritadrinks.in `product-9`, `-10`; `product-red-fusion`, `product-ginger-milk-tea` ← ritadrinks.in `product-7`, `-6`; còn lại ← ritajuice.vn (`natural-pineapple` 11, `natural-orange` 12, `natural-mixed-fruit` 13, `natural-mangosteen` 14, `natural-mango` 15, `natural-red-grape` 16, `purple-compound` 17, `juice-guava` 18, `juice-pineapple` 19, `juice-mango` 20, `coco-pistachio` 6, `gold-fusion` 5, `green-fusion` 4, `real-grape` 3, `real-slice` 1, `soda-original` 8). Giữ nguyên file JPG gốc.
  - `bg-factory.png` (3024 × 1330, 120 KB): từ `bg-factory.png` người dùng tải ở thiết kế (4536 × 1995 = 3x, 2,5 MB, nét xanh) → đổi nét sang xám #c8c8c8 giữ độ trong suốt cho giống thiết kế (nét đậm nhất trên ảnh chụp là #cbcbcb trên nền #f4f4f4), thu về 2x, PNG 32 màu (WebP có kênh alpha nặng 380–630 KB nên không dùng). `bg-grid.webp` (3024 × 1634, 82 KB): từ `bg-grid.png` 4536 × 2451 (lưới trắng trên nền trong suốt), thu về 2x, WebP q80. Cả hai phủ đúng 1512 px thiết kế (`--bg-art-w`), màn hẹp hơn thì giữ cỡ và lấy phần giữa.
  - `can-base.webp`, `can-label.webp`: chép từ `C:\Harry\can-spin-3d\assets` (`can-base.webp`, `label-text.webp`).
  - `ic-arrow-right.svg`: vẽ mới theo mũi tên của nút trong thiết kế. `ic-filter.svg`: icon phễu vẽ mới cho nút lọc tablet / mobile.
- Đặt tên ảnh theo quy tắc ritajuice.vn: chữ thường, gạch nối, tiền tố theo chỗ dùng (`hero-*`, `cate-*`, `ic-*`, `cutout-*`, `service-*`). **Ảnh chụp / ảnh nền đặc dùng WebP** (từ 2026-11-14, thay quy tắc JPG cũ để giảm dung lượng); ảnh trong suốt dùng WebP có alpha; nét vẽ ít màu (`bg-factory.png`) giữ PNG palette vì nhẹ hơn WebP; icon nhỏ PNG / SVG.
- **Hiệu năng cuộn** (người dùng yêu cầu 2026-11-14 cuộn mượt): mọi hiệu ứng theo cuộn chạy qua `requestAnimationFrame` và chỉ ghi biến CSS (`--k`, `--drop`, `--spin`, `--x`, …) để trình duyệt chỉ ghép lớp; `CardDeckModule` chỉ tính khi section trong / gần màn hình (IntersectionObserver, lề 200 px); `will-change` cho 2 thẻ Services và vòng chữ huy hiệu; dải chữ sóng / lon CanSpin dừng khi khuất. Utility **`.cv-auto`** (`content-visibility: auto; contain-intrinsic-size: auto 900px`) cho section dưới màn đầu không có sticky (New releases, Why choose us, footer) — trình duyệt bỏ qua dựng hình tới khi cuộn gần; **không** gắn cho section danh mục (LoadMoreModule đọc số cột lưới) và các section ghim. `index.html` có `<link rel="modulepreload">` cho `main.js` + 3 module màn chào để màn chào có JS sớm. Đã kiểm tra bằng Chrome headless: cuộn hết trang không ảnh hỏng, không 404, không lỗi JS.

## 8. Bàn giao WordPress

- Menu: `wp_nav_menu(['theme_location' => …, 'container' => 'nav', 'container_class' => 'primary-nav__menu', 'container_aria_label' => 'Main menu', 'menu_class' => 'primary-menu'])` đặt trong `div.primary-nav` (cùng với nút tìm kiếm và form); menu mobile gọi lại cùng location với `menu_class => 'mobile-menu'`; footer Products là một menu riêng `menu_class => 'footer-links'` (thứ tự khác header). CSS / JS chỉ bám class WP sinh ra (`menu-item`, `menu-item-has-children`, `sub-menu`, `current-menu-item`, `current-menu-parent`, `current-menu-ancestor`).
- Tìm kiếm: `action` = `home_url('/')`, giữ tên ô `s`, `post_type`, `product_cat`, `filter_packaging`, `filter_volume`.
- Nút: viết HTML trực tiếp theo cấu trúc ở mục Nút (ô `.button__icon` + ô `.button__text`).
