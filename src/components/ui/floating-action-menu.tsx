"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type FloatingActionMenuProps = {
	options: {
		label: string;
		onClick: () => void;
		Icon?: React.ReactNode;
	}[];
	className?: string;
};

const FloatingActionMenu = ({
	options,
	className,
}: FloatingActionMenuProps) => {
	const [isOpen, setIsOpen] = useState(false);

	const toggleMenu = () => {
		setIsOpen(!isOpen);
	};

	return (
		<div className={cn("fixed bottom-8 right-8", className)}>
			<Button
				onClick={toggleMenu}
				className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-300"
			>
				<motion.div
					animate={{ rotate: isOpen ? 45 : 0 }}
					transition={{
						duration: 0.3,
						ease: "easeInOut",
						type: "spring",
						stiffness: 300,
						damping: 20,
					}}
				>
					<Plus className="w-6 h-6 text-white" />
				</motion.div>
			</Button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, x: 10, y: 10, filter: "blur(10px)" }}
						animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
						exit={{ opacity: 0, x: 10, y: 10, filter: "blur(10px)" }}
						transition={{
							duration: 0.6,
							type: "spring",
							stiffness: 300,
							damping: 20,
							delay: 0.1,
						}}
						className="absolute bottom-10 right-0 mb-2"
					>
						<div className="flex flex-col items-end gap-2">
							{options.map((option, index) => (
								<motion.div
									key={index}
									initial={{ opacity: 0, x: 20 }}
									animate={{ opacity: 1, x: 0 }}
									exit={{ opacity: 0, x: 20 }}
									transition={{
										duration: 0.3,
										delay: index * 0.05,
									}}
								>
									<Button
										onClick={option.onClick}
										size="sm"
										className="flex items-center gap-2 bg-white/90 hover:bg-white border border-emerald-200 hover:border-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] rounded-xl backdrop-blur-sm text-emerald-700 hover:text-emerald-800 transition-all duration-300"
									>
										{option.Icon}
										<span>{option.label}</span>
									</Button>
								</motion.div>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default FloatingActionMenu;
