"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function BreathingApp() {
	const [phase, setPhase] = useState("inhale");
	const [inhale, setInhale] = useState(4);
	const [hold, setHold] = useState(2);
	const [exhale, setExhale] = useState(4);
	const [timer, setTimer] = useState(0);
	const [running, setRunning] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(true);

	useEffect(() => {
		if (!running) return;
		const totalCycle = inhale + hold + exhale;
		const interval = setInterval(() => {
			setTimer((prev) => (prev + 1) % totalCycle);
		}, 1000);
		return () => clearInterval(interval);
	}, [inhale, hold, exhale, running]);

	useEffect(() => {
		if (timer < inhale) setPhase("inhale");
		else if (timer < inhale + hold) setPhase("hold");
		else setPhase("exhale");
	}, [timer, inhale, hold, exhale]);

	const getScale = () => {
		if (phase === "inhale") return 1.6;
		if (phase === "hold") return 1.6;
		return 1;
	};

	const getTransition = () => {
		if (phase === "inhale") return inhale;
		if (phase === "hold") return hold;
		return exhale;
	};

	const getText = () => {
		if (phase === "inhale") return "Inhale";
		if (phase === "hold") return "Hold";
		return "Exhale";
	};

	const getRemainingTime = () => {
		if (phase === "inhale") return inhale - timer;
		if (phase === "hold") return inhale + hold - timer;
		return inhale + hold + exhale - timer;
	};

	return (
		<div className="min-h-screen flex bg-cover bg-center text-white relative">
			<Image
				src="/bg-image.jpg"
				alt="background"
				className="w-full h-full object-cover"
				fill
			/>
			{/* Sidebar */}
			<motion.div
				animate={{
					width: sidebarOpen ? 320 : 0,
					opacity: sidebarOpen ? 1 : 0,
				}}
				transition={{ duration: 0.5, ease: "easeInOut" }}
				className={`bg-black/70 backdrop-blur-xl border-r border-white/30 flex flex-col justify-between overflow-hidden ${
					!sidebarOpen ? "pointer-events-none" : ""
				}`}
			>
				{sidebarOpen && (
					<div className="p-6 flex flex-col justify-between h-full">
						<div>
							<h1 className="ml-15 text-3xl font-semibold mb-6 tracking-wide">
								Breathe your Break
							</h1>
							<div className="mb-5">
								<label className="block mb-2 font-semibold text-white">
									Inhale: {inhale}s
								</label>
								<Slider
									value={[inhale]}
									min={2}
									max={10}
									step={1}
									onValueChange={(v) => setInhale(v[0])}
								/>
							</div>
							<div className="mb-5">
								<label className="block mb-2 font-semibold text-white">
									Hold: {hold}s
								</label>
								<Slider
									value={[hold]}
									min={0}
									max={8}
									step={1}
									onValueChange={(v) => setHold(v[0])}
								/>
							</div>
							<div className="mb-5">
								<label className="block mb-2 font-semibold text-white">
									Exhale: {exhale}s
								</label>
								<Slider
									value={[exhale]}
									min={2}
									max={10}
									step={1}
									onValueChange={(v) => setExhale(v[0])}
								/>
							</div>
							<Button
								onClick={() => setRunning((r) => !r)}
								className="w-full mt-3 cursor-pointer text-white bg-gradient-to-r from-[#262626] to-[#1a1a1a] hover:from-[#1a1a1a] hover:to-black rounded-lg px-5 py-2 transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] hover:shadow-[0_0_25px_rgba(255,255,255,0.1)] active:shadow-[0_0_15px_rgba(255,255,255,0.2)] relative overflow-hidden group"
							>
								<span className="relative z-10 inline-flex items-center justify-center gap-2 font-medium">
									{running ? (
										<>
											<span className="inline-block w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
											<span>Stop</span>
										</>
									) : (
										<>
											<span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
											<span>Start</span>
										</>
									)}
								</span>
								<span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out"></span>
							</Button>
						</div>
						<footer className="text-lg text-white opacity-90 italic font-semibold text-center mb-2">
							Find your calm 🌿
						</footer>
					</div>
				)}
			</motion.div>

			{/* Toggle Button */}
			<button
				onClick={() => setSidebarOpen(!sidebarOpen)}
				className="absolute top-6 left-4 bg-white/40 backdrop-blur-md p-2 rounded-full shadow-md hover:bg-white/60 transition z-50 cursor-cell"
			>
				{sidebarOpen ? (
					<ChevronLeft className="text-white" />
				) : (
					<ChevronRight className="text-white" />
				)}
			</button>

			{/* Main breathing visual */}
			<div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
				{running && (
					<p className="absolute bottom-15 text-3xl font-semibold text-white drop-shadow-lg tracking-wide">
						{getText()}{" "}
						<span className="text-2xl font-medium opacity-90">
							({getRemainingTime()}s)
						</span>
					</p>
				)}

				{/* Ambient particles */}
				{[...Array(20)].map((_, i) => (
					<motion.div
						key={i}
						className="absolute rounded-full bg-white/40 backdrop-blur-sm"
						style={{ width: 8, height: 8 }}
						animate={{
							y: [0, -50, 0],
							x: [0, Math.random() * 30 - 15, 0],
							opacity: [0.3, 0.7, 0.3],
						}}
						transition={{
							duration: 4 + Math.random() * 3,
							repeat: Infinity,
							ease: "easeInOut",
							delay: i * 0.2,
						}}
					/>
				))}

				<motion.div
					className="w-64 h-64 bg-gradient-to-br from-emerald-400 via-sky-400 to-indigo-400 shadow-2xl rounded-[2.5rem] rotate-45 border border-white/30"
					animate={{
						scale: running ? getScale() : 1,
						rotate: phase === "exhale" ? 45 : 0,
						borderRadius: phase === "hold" ? "50%" : "25%",
					}}
					transition={{
						duration: getTransition(),
						ease: "easeInOut",
					}}
				/>
			</div>
		</div>
	);
}
