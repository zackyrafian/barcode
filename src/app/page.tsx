"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import QRCode from "react-qr-code";

interface QRCodeGeneratorProps {
  value: string;
  size: number;
  level: "L" | "M" | "Q" | "H";
  bgColor: string;
  fgColor: string;
  style?: string;
}

const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({ 
  value, 
  size,
  level,
  bgColor,
  fgColor,
  style = "default"
}) => {
  const getStyleClass = () => {
    switch(style) {
      case "rounded":
        return "rounded-[2rem] overflow-hidden";
      case "dots":
        return "[&_path]:!rx-full [&_path]:!ry-full";
      case "elegant":
        return "[&_path]:!rx-[5px] [&_path]:!ry-[5px] [&_path]:!stroke-1";
      default:
        return "";
    }
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`p-8 rounded-2xl ${
        style === "gradient" ? "bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/20 dark:to-purple-900/20" : "bg-white"
      } shadow-xl transition-all duration-300 hover:shadow-2xl`}>
        <div className={getStyleClass()}>
          <QRCode
            value={value}
            size={size}
            level={level}
            bgColor={bgColor}
            fgColor={fgColor}
          />
        </div>
      </div>
    </div>
  );
};

const QR_STYLES = [
  { id: "default", name: "Standard", description: "QR Code standar" },
  { id: "rounded", name: "Rounded", description: "Dengan sudut membulat" },
  { id: "dots", name: "Dots", description: "Pattern berbentuk dots" },
  { id: "elegant", name: "Elegant", description: "Desain elegan dengan stroke" },
  { id: "gradient", name: "Gradient", description: "Dengan background gradient" }
];

const COLOR_PRESETS = [
  { bg: "#FFFFFF", fg: "#000000", name: "Classic" },
  { bg: "#FFFFFF", fg: "#FF0000", name: "Red" },
  { bg: "#FFFFFF", fg: "#0000FF", name: "Blue" },
  { bg: "#FFFFFF", fg: "#4F46E5", name: "Indigo" },
  { bg: "#FFFFFF", fg: "#7C3AED", name: "Purple" },
  { bg: "#000000", fg: "#FFFFFF", name: "Inverse" },
  { bg: "#FDF2F8", fg: "#DB2777", name: "Pink" },
  { bg: "#ECFDF5", fg: "#059669", name: "Emerald" }
];

export default function Home() {
  const [qrValue, setQrValue] = useState("https://example.com");
  const [size, setSize] = useState(256);
  const [errorLevel, setErrorLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [fgColor, setFgColor] = useState("#000000");
  const [selectedStyle, setSelectedStyle] = useState("default");
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQRCode = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = document.createElement("img") as HTMLImageElement;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      if (ctx) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        const pngFile = canvas.toDataURL("image/png", 1.0);
        const downloadLink = document.createElement("a");
        downloadLink.download = `qrcode-${Date.now()}.png`;
        downloadLink.href = pngFile;
        downloadLink.click();
      }
    };

    img.src = `data:image/svg+xml;base64,${window.btoa(svgData)}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Main Content */}
          <div className="grid md:grid-cols-2 gap-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            {/* Left Column - Input Controls */}
            <div className="space-y-6">
              <div className="space-y-4">
                <label className="block font-medium text-gray-700 dark:text-gray-200">
                  Masukkan Teks atau URL
                </label>
                <textarea
                  value={qrValue}
                  onChange={(e) => setQrValue(e.target.value)}
                  placeholder="Masukkan teks atau URL"
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-200"
                  rows={4}
                />
              </div>

              {/* Style Selector */}
              <div className="space-y-3">
                <label className="block font-medium text-gray-700 dark:text-gray-200">
                  Style QR Code
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {QR_STYLES.map((style) => (
                    <button
                      key={style.id}
                      onClick={() => setSelectedStyle(style.id)}
                      className={`p-3 rounded-lg text-left text-sm transition-all ${
                        selectedStyle === style.id
                          ? "bg-blue-100 dark:bg-blue-900 border-2 border-blue-500"
                          : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600"
                      }`}
                    >
                      <div className="font-medium">{style.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {style.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Color Presets */}
              <div className="space-y-3">
                <label className="block font-medium text-gray-700 dark:text-gray-200">
                  Color Preset
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {COLOR_PRESETS.map((preset, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setBgColor(preset.bg);
                        setFgColor(preset.fg);
                      }}
                      className="group relative p-2 rounded-lg border-2 border-transparent hover:border-blue-500 transition-all"
                    >
                      <div
                        className="w-full h-8 rounded-md"
                        style={{ backgroundColor: preset.fg }}
                      />
                      <div className="text-xs mt-1 text-center text-gray-600 dark:text-gray-300">
                        {preset.name}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Colors */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-200 mb-2">
                    Background Color
                  </label>
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block font-medium text-gray-700 dark:text-gray-200 mb-2">
                    QR Code Color
                  </label>
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-full h-10 rounded-lg cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Right Column - QR Code Display */}
            <div className="flex flex-col items-center justify-center gap-6" ref={qrRef}>
              <QRCodeGenerator 
                value={qrValue} 
                size={size}
                level={errorLevel}
                bgColor={bgColor}
                fgColor={fgColor}
                style={selectedStyle}
              />

              <button
                onClick={downloadQRCode}
                className="w-full py-3 px-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center justify-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download QR Code
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}