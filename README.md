This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

# WellHomeKitchen - Frontend (FE)

Frontend cho dự án WellHomeKitchen, xây dựng bằng **Next.js 16+**, chạy bằng **Docker**.

---

## Công nghệ sử dụng

- Next.js 16+ (App Router)
- Tailwind CSS
- Docker & Docker Compose

---

## Cấu trúc thư mục

```
WellHomeKitchen_FE/
├── src/                # Source code chính
├── public/             # Static assets (ảnh, icon,...)
├── nginx/              # Cấu hình nginx (nếu có)
├── next.config.mjs     # Cấu hình Next.js
├── tailwind.config.js  # Cấu hình Tailwind CSS
├── postcss.config.mjs
├── jsconfig.json
├── docker-compose.yml
├── Dockerfile
└── package.json
```

---

## Biến môi trường

Tạo file `.env.production` ở thư mục gốc:

```dotenv
NEXT_PUBLIC_API_URL=https://bepanphu.vn
```

---

## Chạy dự án bằng Docker

### Khởi động

```bash
cd WellHomeKitchen_FE
docker compose up -d
```

Container `wellhomekitchen-fe` sẽ chạy ở port 3000.

### Dừng

```bash
docker compose down
```

### Xem log

```bash
docker logs wellhomekitchen-fe --tail=50
```

### Rebuild lại image (khi có thay đổi code)

```bash
docker compose down
docker compose up -d --build
```

---

## Triển khai (Deploy)

Server đang chạy trên VPS với **aaPanel** + **Nginx** + **Docker**.

Nginx proxy toàn bộ request `/` vào port 3000, riêng `/api/*` được proxy sang BE port 4000.

Sau khi chỉnh sửa code, để deploy lại:

```bash
cd /home/Bep_An_Phu/WellHomeKitchen_FE
git pull
docker compose down
docker compose up -d --build
```

---

## Ghi chú

- FE build theo kiểu **Next.js standalone output**, image Docker nhỏ gọn hơn.
- Mọi request API từ FE đều đi qua `NEXT_PUBLIC_API_URL`, tức là qua Nginx rồi mới tới BE.
- Static files của BE (ảnh upload,...) được serve trực tiếp qua Nginx tại đường dẫn `/public/`.