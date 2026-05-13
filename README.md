# Movie

Next.js дээр хийсэн энгийн multi-step form project.

## Ажиллуулах

```bash
npm run dev
```

Browser дээр terminal дээр гарсан local URL-ийг нээнэ.

Жишээ нь:

```bash
http://localhost:3000
```

Хэрвээ `3000` port ашиглагдаж байвал Next.js өөр port сонгоно. Жишээ нь `3002`, `3003` гэх мэт.

## Project Бүтэц

```bash
src/app/page.js
src/components/MultiStepForm.js
src/components/FormInput.js
src/components/FormButton.js
public/pinelogo.png
```

## Component-ууд

`page.js` дотор main form component дуудагдана.

```js
import MultiStepForm from "@/components/MultiStepForm";

export default function Home() {
  return <MultiStepForm />;
}
```

`MultiStepForm.js` дотор form-ийн step, input value, validation зэрэг state-үүд байна.

`FormInput.js` нь props ашиглаж input дахин ашиглахад зориулагдсан.

`FormButton.js` нь props ашиглаж button дахин ашиглахад зориулагдсан.

## Ашигласан зүйлс

- Next.js
- React
- Tailwind CSS
- public доторх `pinelogo.png`
