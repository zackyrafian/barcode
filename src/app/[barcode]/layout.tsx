// app/[barcode]/layout.tsx
export default function BarcodeLayout({
    children,
  }: {
    children: React.ReactNode
  }) {
    return (
      <div>
        {children}
      </div>
    )
  }