# RITA Food & Drink (rita.com.vn) — Design System

Site tĩnh tiếng Anh (`lang="en"`), không build tool. Code dựng lại theo cấu trúc dự án gần nhất **ritajuice.vn** (cùng cách đặt tên class, hook `…JS`, `js/main.js` nạp module, `assets/library`), giao diện theo thiết kế rita.com.vn (khung 1512 × 900). Hiện mới làm **header + hero + footer** ở `index.html`; các trang còn lại là file HTML rỗng (chỉ có `<title>`) để link trong menu / footer trỏ đúng. Khi dựng trang mới: chép nguyên header, dialog menu mobile, footer và 3 thẻ script từ `index.html`, đổi mục đang xem (`current-menu-item` + `aria-current="page"` trên `li` / `a` tương ứng ở cả menu desktop lẫn mobile).

## 1. Quy tắc chung

1. **Chỉ dùng token** trong `:root` (màu, cỡ chữ, khoảng cách, thời gian). Thiếu thì thêm token trước.
2. Hook JS là class `…JS`, **không bao giờ được style**.
3. Không comment trong CSS / HTML / JS, trừ chỗ giải thích workaround không hiển nhiên (vd. `js/pointer.js`).
4. Không dùng `box-shadow`. Không bo góc (thiết kế góc vuông).
5. Mọi nút có chữ dùng hiệu ứng chữ 3D: bọc chữ trong `<span class="button-label letterSwapJS">`.
6. Ảnh dưới màn hình đầu: `loading="lazy" decoding="async"`, luôn có `width` / `height`. Icon một màu tô bằng `mask` + `currentColor`.

## 2. Font

**Montserrat** variable (trục `wght` 100–900, chỉ kiểu đứng), tự host trong `assets/fonts/montserrat/` (Google Fonts v31), 3 subset theo `unicode-range` trong `css/fonts.css`, **thứ tự bắt buộc latin-ext → vietnamese → latin** (như ritajuice.vn). Preload `montserrat-variable-latin.woff2`.

**Giãn chữ −2 % cho toàn bộ chữ**: khai báo `letter-spacing: var(--ls)` (`-0.02em`) trên `*`, `::before`, `::after` để mỗi phần tử tự tính theo cỡ chữ của chính nó (đặt ở `body` thì con sẽ kế thừa giá trị px của `body`, sai với chữ to / nhỏ).

| Vai trò | Token | Cỡ | Weight | Line-height | Ghi chú |
|---|---|---|---|---|---|
| Tiêu đề H2 | `--fs-h2` | 48 (≤ 1512 co về tối thiểu 30) | 700 | `--lh-h2` 150 % | theo yêu cầu người dùng 2026-11-13 |
| Chữ mô tả thông thường | `--fs-body` | 16 | 400 | `--lh-body` 120 % | theo yêu cầu người dùng; mặc định của `body` |
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
  - `.container.container--wide` **chỉ cho header và footer**, sát mép hơn: lề `--page-gutter-wide` = 40 px ở 1512 (`clamp(16px, 2.646vw, 48px)`), tối đa `--container-wide` 1600. **Nút ‹ › của hero dùng cùng token** nên mép nút thẳng hàng logo / nút CONTACT / nội dung footer. Muốn đổi khoảng cách sát mép thì chỉ sửa `--page-gutter-wide`.
  - ≤ 1120 cả hai lề = `clamp(16px, 3.125vw, 32px)`.
- `main` chừa `--hd-h` (90) phía trên; trang có hero / banner nằm dưới header thì thêm `.site-header--overlay` vào header để `main` không chừa (`.site-header--overlay ~ main`). ≤ 1120 `main` luôn chừa `--hd-mobile-h` + 1 px.

## 5. Component

### Nút — `.button`
Cấu trúc: ô mũi tên vuông + khe 3 px + ô chữ (thiết kế "→ | CONTACT US"):
```html
<a class="button button--primary" href="./contact.html"><span class="button__icon" aria-hidden="true"></span><span class="button__text"><span class="button-label letterSwapJS">Contact us</span></span></a>
```
- Cao `--btn-h` 50, ô mũi tên vuông bằng chiều cao (mũi tên `ic-arrow-right.svg` rộng 42 % ô), ô chữ rộng tối thiểu `--btn-min-w` 144, đệm ngang `--btn-pad` 21, chữ 16 Bold in hoa.
- Biến thể màu (đổi bằng biến `--btn-bg`, `--btn-bg-hover`, `--btn-fg`, `--btn-fg-hover`, `--btn-border`, `--btn-border-hover`):
  - `.button--primary` đỏ, hover `--red-dark`.
  - `.button--dark` nền `--ink`, hover đỏ.
  - `.button--outline` **dùng trên nền màu / ảnh** (người dùng yêu cầu 2026-11-13): nền trong suốt, viền trắng 1 px cả 2 ô, chữ / mũi tên trắng; hover đổ nền trắng, chữ / mũi tên đổi `--ink`.
- Cỡ / kiểu: `.button--sm` (cao `--btn-h-sm` 44, dùng cho nút Submit của tìm kiếm); `.button--prev` lật mũi tên sang trái. Nút chỉ có icon (nút ‹ › hero) = `.button` chỉ chứa `.button__icon`.
- Hover: mũi tên chạy ra mép rồi vào lại từ phía đối diện (`arrow-loop`, chiều theo `--arrow-dir`), chữ lật 3D.

### Header — `.site-header`
- Desktop: `position: fixed`, **cao `--hd-h` 90, trong suốt, cuộn trang không đổ nền** (người dùng yêu cầu 2026-11-13); nội dung cao 50 (`--box-h`) căn giữa theo chiều dọc (cách trên / dưới 20).
- Hàng: logo `logo.svg` rộng `--logo-w` 93 · hộp menu trắng `.primary-nav` (cao 50, đệm ngang 32, các mục cách 32, căn giữa khoảng trống giữa logo và nút CONTACT bằng `margin-inline: auto`) · `.header-contact` (hộp trắng 50, chấm đỏ 12 px có vòng lan `dot-pulse`, chữ CONTACT 14 Bold, đệm 16 / 20).
- Mục cha có chevron `ic-dropdown.svg` 11 × 6.5 cách chữ 8 (thiết kế không xoay chevron khi mở).
- **Dropdown** `.sub-menu`: tấm trắng **rộng đúng bằng hộp menu**, cách hộp 4 px (`--panel-gap`, có cầu nối `::before` để rê chuột qua khe không bị đóng), đệm 20 / 32, lưới **4 hàng × 32 px, xếp theo cột** (`grid-auto-flow: column`), mỗi cột rộng 245 → cao luôn 168 kể cả menu ít mục. Thứ tự trong HTML là thứ tự đọc theo cột của thiết kế (About: Story, Activities, Awards, Certificates | History, Brands; Products: 10 danh mục 3 cột; Services: OEM, ODM; Blog: RITA news, Beverage news, Tropical fruit, Beverage market).
- Mở menu con: rê chuột (chỉ khi chuột thật sự di chuyển, xem `js/pointer.js`), focus bàn phím, chạm lần 1 trên màn cảm ứng; đóng khi rời mục, Esc, click ngoài, cuộn trang (trừ khi focus đang ở trong).
- ≤ 1120: thanh trắng cao 60 kẻ dưới `--line-soft`; logo 80 · CONTACT (ẩn ≤ 680) · icon tìm kiếm · nút menu. Hộp menu desktop ẩn.

### Tìm kiếm — `form.header-search` (trong `.primary-nav`)
- Desktop: tấm trắng cùng vị trí / bề rộng với dropdown, đệm 32; form rộng 550 căn giữa: 2 select **Choose packaging / Choose volume** (cách 16) → ô **Search for products** cả hàng → nút Submit (`.button--primary.button--sm`) căn giữa. Ô cao 48, viền 1 px `--ink`, chevron `ic-dropdown.svg` cách phải 16; focus thì viền dày 2 px (outline lùi vào trong).
- **Mở bằng rê chuột vào icon kính lúp** (người dùng yêu cầu 2026-11-13), không chiếm focus; rời khỏi hộp menu + tấm tìm kiếm, rê sang mục menu khác hoặc cuộn trang thì đóng. Đã click / focus vào form (gõ chữ, chọn select) thì tấm **giữ nguyên**, chỉ đóng bằng Esc, click ra ngoài hoặc bấm lại icon. Bấm icon (chuột / bàn phím) = mở và focus ô tìm kiếm. Đang tìm kiếm thì menu con không bung khi rê chuột qua.
- ≤ 1120: tấm xổ xuống ngay dưới thanh header, full ngang; ≤ 680 các ô xếp 1 cột.
- Tham số: `s`, `filter_packaging`, `filter_volume` (kiểu bộ lọc thuộc tính WooCommerce `pa_packaging`, `pa_volume`), ẩn `post_type=product`, `action` → `searching.html`. Danh sách bao bì / dung tích lấy từ form tìm kiếm của site rita.com.vn hiện tại. Tham số trên URL tự điền lại vào form.

### Menu mobile — `dialog.site-menu`
Như ritajuice.vn: dialog toàn màn trượt từ phải, menu "trượt từng tầng" (`MobileMenuModule`: bấm mục cha → nút Back + tiêu đề nhóm + link con), cuối panel có nút Contact us + email + số Sales. Mục cấp 1 18 Bold in hoa, link con 14 in hoa, kẻ `--line-soft`.

### Hero — `section.hero` (trang chủ)
- Swiper fade, `rewind`, tự chuyển sau `--hero-delay` 6 s theo thanh tiến trình đỏ 3 px ở đáy, kéo / bàn phím được.
- Desktop: cao `--hero-h` = `min(100svh, 59.524vw)` (đúng 900 ở khung 1512 × 900 của thiết kế), ảnh `cover` căn giữa → ở 1512 × 900 ảnh 1920 × 1009 phóng 0.892, cắt khoảng 100 px mỗi bên đúng như thiết kế. ≤ 1120: khung theo tỉ lệ ảnh 1920 : 1009, không cắt.
- Nút ‹ › (người dùng yêu cầu 2026-11-13): `.button.button--outline` chỉ có ô mũi tên, **40 px** (`--hero-arrow`, ≤ 1120 36 px; người dùng thấy 50 px to quá), giữa chiều cao hero, cách mép `--page-gutter-wide`; ẩn ≤ 680 (vuốt). Header đè lên mép trên ảnh.
- 2 slide: `hero-01.jpg` (banner thiết kế: lê – gừng nền vàng) và `hero-02.jpg` (dưa leo nền xanh), cùng chiến dịch SIAL Paris / FHC Shanghai / PLMA Chicago 2026 trên site rita.com.vn. Banner thứ 3 của production (dưa hấu nền đỏ) **không dùng** vì logo đỏ trên nền đỏ gần như mất.

### Footer — `.site-footer`
- Nền `--surface`, `.container--wide`, đệm trên 120 / dưới 58; lưới 4 cột tỉ lệ `353.5fr 263.5fr 203fr 452fr`, cách 40 (ở 1512 các cột bắt đầu đúng vị trí thiết kế).
- Cột 1: logo rộng 155 (lùi xuống 10 px như thiết kế) → đoạn giới thiệu (Light 16 / 24, rộng tối đa 336 để xuống dòng như thiết kế) cách 40 → ô Alibaba (link gian hàng) + ô QR 107 × 107, viền `--line`, cách 32.
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
- **JS**: `js/main.js` gồm nhóm module dùng chung (Header, HeaderSearch, SiteMenu, MobileMenu, LetterSwap) và bảng `ON_DEMAND` `[selector, import]` chỉ nạp khi trang có phần tử khớp (`.heroJS` → HeroModule, `[data-fancybox]` → LightboxModule). Thêm module cho trang mới thì thêm một dòng vào bảng. `js/pointer.js`: theo dõi chuột có thật sự di chuyển (dùng chung cho menu và tìm kiếm).
- **Ảnh**:
  - `cate-{fruit-juice, coconut, aloe-vera, sparkling, milk, seed, coffee, energy, tea, special}.jpg` 900 × 555: ảnh người dùng gửi 2026-11-13 (PNG trong Downloads, không có vùng trong suốt) → JPG q84 progressive 4:4:4, tổng 1 MB (PNG gốc 7,8 MB). Chưa dùng ở trang nào (dành cho phần danh mục sản phẩm).
  - `hero-01.jpg`, `hero-02.jpg` (1920 × 1009) + bản `-768`, `-1280` cho `srcset`: banner `Baner_web_Ria_Paris_26_3.jpg` / `_1.jpg` của rita.com.vn, nén lại JPG q82 4:4:4 (chữ trên banner).
  - `logo.svg` (= `logo-header.svg` của ritajuice.vn, dùng cho header, menu mobile, footer), `favicon.jpg`, `ic-search.svg`, `ic-dropdown.svg`, `ic-close.svg`, `ic-next.svg`, `ic-prev.svg`: từ ritajuice.vn.
  - `alibaba.png`, `qr.png`, `ic-facebook.svg`, `ic-youtube.svg`, `ic-tiktok.svg`, `ic-linkedin.svg` (đổi tên từ `ic-linked.svg`), `ic-pinterest.svg`, `ic-x.svg`: từ juice9vn.com (khớp ảnh thiết kế footer).
  - `ic-arrow-right.svg`: vẽ mới theo mũi tên của nút trong thiết kế.
- Đặt tên ảnh theo quy tắc ritajuice.vn: chữ thường, gạch nối, tiền tố theo chỗ dùng (`hero-*`, `cate-*`, `ic-*`). Ảnh nền đặc luôn là JPG; chỉ ảnh trong suốt giữ PNG / SVG.

## 8. Bàn giao WordPress

- Menu: `wp_nav_menu(['theme_location' => …, 'container' => 'nav', 'container_class' => 'primary-nav__menu', 'container_aria_label' => 'Main menu', 'menu_class' => 'primary-menu'])` đặt trong `div.primary-nav` (cùng với nút tìm kiếm và form); menu mobile gọi lại cùng location với `menu_class => 'mobile-menu'`; footer Products là một menu riêng `menu_class => 'footer-links'` (thứ tự khác header). CSS / JS chỉ bám class WP sinh ra (`menu-item`, `menu-item-has-children`, `sub-menu`, `current-menu-item`, `current-menu-parent`, `current-menu-ancestor`).
- Tìm kiếm: `action` = `home_url('/')`, giữ tên ô `s`, `post_type`, `filter_packaging`, `filter_volume`.
- Nút: viết HTML trực tiếp theo cấu trúc mục 5, giữ `letterSwapJS`.
