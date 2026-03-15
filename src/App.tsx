import React, { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { Settings, Target, RefreshCw } from 'lucide-react';

const SVG_WIDTH = 400;
const SVG_HEIGHT = 400;
const SCALE = 21.2;
const ORIGIN_X = SVG_WIDTH / 2;
const ORIGIN_Y = SVG_HEIGHT / 2;

const toScreen = (x: number, y: number) => ({
  x: ORIGIN_X + x * SCALE,
  y: ORIGIN_Y - y * SCALE,
});

const CoordinateSystem = () => {
  const gridLines = [];
  for (let i = -10; i <= 10; i++) {
    const pos = i * SCALE;
    gridLines.push(
      <line
        key={`v-${i}`}
        x1={ORIGIN_X + pos}
        y1={0}
        x2={ORIGIN_X + pos}
        y2={SVG_HEIGHT}
        stroke="#e5e7eb"
        strokeWidth="1"
      />
    );
    gridLines.push(
      <line
        key={`h-${i}`}
        x1={0}
        y1={ORIGIN_Y + pos}
        x2={SVG_WIDTH}
        y2={ORIGIN_Y + pos}
        stroke="#e5e7eb"
        strokeWidth="1"
      />
    );
  }

  return (
    <g>
      {gridLines}
      <line x1={0} y1={ORIGIN_Y} x2={SVG_WIDTH} y2={ORIGIN_Y} stroke="#000" strokeWidth="2" />
      <line x1={ORIGIN_X} y1={0} x2={ORIGIN_X} y2={SVG_HEIGHT} stroke="#000" strokeWidth="2" />
      <text x={SVG_WIDTH - 15} y={ORIGIN_Y - 10} fontSize="12" fontWeight="bold">X</text>
      <text x={ORIGIN_X + 10} y={15} fontSize="12" fontWeight="bold">Y</text>
    </g>
  );
};

const ControlPanel = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-4">
    <h3 className="text-sm font-semibold text-slate-700 mb-3 uppercase tracking-wider flex items-center gap-2">
      <Settings size={16} /> {title}
    </h3>
    <div className="space-y-4">{children}</div>
  </div>
);

const SliderInput = ({
  label,
  value,
  onChange,
  min,
  max,
  step = 0.1,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
}) => (
  <div className="flex flex-col gap-1">
    <div className="flex justify-between items-center">
      <label className="text-sm font-medium text-slate-600">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
        className="w-20 text-right text-sm border border-slate-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        step={step}
      />
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(parseFloat(e.target.value))}
      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
    />
  </div>
);

const SectionTranslation = () => {
  const [dx, setDx] = useState(3);
  const [dy, setDy] = useState(2);

  const start = toScreen(0, 0);
  const end = toScreen(dx, dy);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Pure Translation</h2>
        <p className="text-slate-600 mb-6">
          Translation moves a point without rotation. The new position <InlineMath math="X" /> is the sum of the original position <InlineMath math="x" /> and the displacement vector <InlineMath math="d" />.
        </p>

        <ControlPanel title="Controls">
          <SliderInput label="Base X (dx)" value={dx} onChange={setDx} min={-8} max={8} />
          <SliderInput label="Base Y (dy)" value={dy} onChange={setDy} min={-8} max={8} />
        </ControlPanel>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 overflow-x-auto">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">Step-by-Step Calculation</h3>
          <div className="space-y-4 text-sm">
            <div>
              <span className="font-medium text-slate-500">Step 1 — Formula</span>
              <BlockMath math="X = x + d" />
            </div>
            <div>
              <span className="font-medium text-slate-500">Step 2 — Substitution</span>
              <BlockMath math={`\\begin{bmatrix} X_x \\\\ X_y \\end{bmatrix} = \\begin{bmatrix} 0 \\\\ 0 \\end{bmatrix} + \\begin{bmatrix} ${dx.toFixed(1)} \\\\ ${dy.toFixed(1)} \\end{bmatrix}`} />
            </div>
            <div>
              <span className="font-medium text-slate-500">Step 3 — Final Position</span>
              <BlockMath math={`X = \\begin{bmatrix} ${dx.toFixed(1)} \\\\ ${dy.toFixed(1)} \\end{bmatrix}`} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <svg width={SVG_WIDTH} height={SVG_HEIGHT} className="bg-slate-50 rounded-lg">
          <CoordinateSystem />
          <circle cx={start.x} cy={start.y} r="4" fill="#64748b" />
          <line
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke="#4f46e5"
            strokeWidth="3"
            markerEnd="url(#arrowhead)"
          />
          <circle cx={end.x} cy={end.y} r="6" fill="#4f46e5" />
          <text x={end.x + 10} y={end.y - 10} fill="#4f46e5" fontSize="14" fontWeight="bold">
            ({dx.toFixed(1)}, {dy.toFixed(1)})
          </text>
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#4f46e5" />
            </marker>
          </defs>
        </svg>
      </div>
    </div>
  );
};

const SectionRotation = () => {
  const [theta, setTheta] = useState(45);
  const L = 5; // Fixed length for demonstration

  const rad = (theta * Math.PI) / 180;
  const x = L * Math.cos(rad);
  const y = L * Math.sin(rad);

  const start = toScreen(0, 0);
  const end = toScreen(x, y);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Pure Rotation</h2>
        <p className="text-slate-600 mb-6">
          Rotation of a vector in 2D uses a rotation matrix <InlineMath math="A(\theta)" />.
        </p>

        <ControlPanel title="Controls">
          <SliderInput label="Angle θ (degrees)" value={theta} onChange={setTheta} min={-180} max={180} step={1} />
        </ControlPanel>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 overflow-x-auto">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">Step-by-Step Calculation</h3>
          <div className="space-y-4 text-sm">
            <div>
              <span className="font-medium text-slate-500">Step 1 — Formula</span>
              <BlockMath math="X = A(\theta)x" />
              <BlockMath math="A(\theta) = \begin{bmatrix} \cos\theta & -\sin\theta \\ \sin\theta & \cos\theta \end{bmatrix}" />
            </div>
            <div>
              <span className="font-medium text-slate-500">Step 2 — Numeric Matrix</span>
              <BlockMath math={`A(${theta}^\\circ) = \\begin{bmatrix} ${Math.cos(rad).toFixed(3)} & ${(-Math.sin(rad)).toFixed(3)} \\\\ ${Math.sin(rad).toFixed(3)} & ${Math.cos(rad).toFixed(3)} \\end{bmatrix}`} />
            </div>
            <div>
              <span className="font-medium text-slate-500">Step 3 — Final Position (L={L})</span>
              <BlockMath math={`X = \\begin{bmatrix} ${Math.cos(rad).toFixed(3)} & ${(-Math.sin(rad)).toFixed(3)} \\\\ ${Math.sin(rad).toFixed(3)} & ${Math.cos(rad).toFixed(3)} \\end{bmatrix} \\begin{bmatrix} ${L} \\\\ 0 \\end{bmatrix} = \\begin{bmatrix} ${x.toFixed(2)} \\\\ ${y.toFixed(2)} \\end{bmatrix}`} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <svg width={SVG_WIDTH} height={SVG_HEIGHT} className="bg-slate-50 rounded-lg">
          <CoordinateSystem />
          
          {/* Arc for angle */}
          {theta !== 0 && (
            <path
              d={`M ${start.x + 30} ${start.y} A 30 30 0 ${Math.abs(theta) > 180 ? 1 : 0} ${theta < 0 ? 0 : 1} ${start.x + 30 * Math.cos(rad)} ${start.y - 30 * Math.sin(rad)}`}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
            />
          )}
          
          <line
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke="#10b981"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx={start.x} cy={start.y} r="4" fill="#000" />
          <circle cx={end.x} cy={end.y} r="6" fill="#10b981" />
          <text x={end.x + 10} y={end.y - 10} fill="#10b981" fontSize="14" fontWeight="bold">
            ({x.toFixed(1)}, {y.toFixed(1)})
          </text>
        </svg>
      </div>
    </div>
  );
};

const SectionRigidBody = () => {
  const [dx, setDx] = useState(2);
  const [dy, setDy] = useState(3);
  const [theta, setTheta] = useState(30);
  const L = 4;

  const rad = (theta * Math.PI) / 180;
  const x = dx + L * Math.cos(rad);
  const y = dy + L * Math.sin(rad);

  const start = toScreen(dx, dy);
  const end = toScreen(x, y);
  const origin = toScreen(0, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Rotation + Translation</h2>
        <p className="text-slate-600 mb-6">
          Rigid body transformation combines rotation and translation. This is the standard equation in 2D robotics.
        </p>

        <ControlPanel title="Controls">
          <SliderInput label="Base X (dx)" value={dx} onChange={setDx} min={-5} max={5} />
          <SliderInput label="Base Y (dy)" value={dy} onChange={setDy} min={-5} max={5} />
          <SliderInput label="Angle θ (degrees)" value={theta} onChange={setTheta} min={-180} max={180} step={1} />
        </ControlPanel>

        <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 overflow-x-auto">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 uppercase tracking-wider">Step-by-Step Calculation</h3>
          <div className="space-y-4 text-sm">
            <div>
              <span className="font-medium text-slate-500">Step 1 — Formula</span>
              <BlockMath math="X = A(\theta)x + d" />
            </div>
            <div>
              <span className="font-medium text-slate-500">Step 2 — Substitution</span>
              <BlockMath math={`X = \\begin{bmatrix} ${Math.cos(rad).toFixed(3)} & ${(-Math.sin(rad)).toFixed(3)} \\\\ ${Math.sin(rad).toFixed(3)} & ${Math.cos(rad).toFixed(3)} \\end{bmatrix} \\begin{bmatrix} ${L} \\\\ 0 \\end{bmatrix} + \\begin{bmatrix} ${dx.toFixed(1)} \\\\ ${dy.toFixed(1)} \\end{bmatrix}`} />
            </div>
            <div>
              <span className="font-medium text-slate-500">Step 3 — Final Position</span>
              <BlockMath math={`X = \\begin{bmatrix} ${(L * Math.cos(rad)).toFixed(2)} \\\\ ${(L * Math.sin(rad)).toFixed(2)} \\end{bmatrix} + \\begin{bmatrix} ${dx.toFixed(1)} \\\\ ${dy.toFixed(1)} \\end{bmatrix} = \\begin{bmatrix} ${x.toFixed(2)} \\\\ ${y.toFixed(2)} \\end{bmatrix}`} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <svg width={SVG_WIDTH} height={SVG_HEIGHT} className="bg-slate-50 rounded-lg">
          <CoordinateSystem />
          
          {/* Translation Vector */}
          <line
            x1={origin.x}
            y1={origin.y}
            x2={start.x}
            y2={start.y}
            stroke="#94a3b8"
            strokeWidth="2"
            strokeDasharray="4 4"
          />
          
          {/* Link */}
          <line
            x1={start.x}
            y1={start.y}
            x2={end.x}
            y2={end.y}
            stroke="#ec4899"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx={start.x} cy={start.y} r="5" fill="#334155" />
          <circle cx={end.x} cy={end.y} r="6" fill="#ec4899" />
          <text x={end.x + 10} y={end.y - 10} fill="#ec4899" fontSize="14" fontWeight="bold">
            ({x.toFixed(1)}, {y.toFixed(1)})
          </text>
        </svg>
      </div>
    </div>
  );
};

const AngleArc = ({ cx, cy, startAngle, angle, radius, color, label }: any) => {
  if (Math.abs(angle) < 0.01) return null;
  const endAngle = startAngle + angle;
  const startX = cx + radius * Math.cos(startAngle);
  const startY = cy - radius * Math.sin(startAngle);
  const endX = cx + radius * Math.cos(endAngle);
  const endY = cy - radius * Math.sin(endAngle);

  const largeArcFlag = Math.abs(angle) > Math.PI ? 1 : 0;
  const sweepFlag = angle > 0 ? 0 : 1;

  const path = `M ${startX} ${startY} A ${radius} ${radius} 0 ${largeArcFlag} ${sweepFlag} ${endX} ${endY}`;
  
  const midAngle = startAngle + angle / 2;
  const labelX = cx + (radius + 16) * Math.cos(midAngle);
  const labelY = cy - (radius + 16) * Math.sin(midAngle);

  return (
    <g>
      <path d={path} fill="none" stroke={color} strokeWidth="2" strokeDasharray="3 3" />
      <text x={labelX} y={labelY} fill={color} fontSize="14" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">{label}</text>
    </g>
  );
};

const PracticeSimulation = () => {
  const L1 = 4;
  const L2 = 3;
  const rMax = L1 + L2;

  const [dx, setDx] = useState(0);
  const [dy, setDy] = useState(0);
  const [theta1, setTheta1] = useState(45);
  const [theta2, setTheta2] = useState(-45);
  const [target, setTarget] = useState({ x: 3, y: 4 });

  const randomizeTarget = () => {
    const angle = Math.random() * Math.PI * 2;
    const r = Math.random() * rMax;
    setTarget({
      x: r * Math.cos(angle),
      y: r * Math.sin(angle),
    });
  };

  const rad1 = (theta1 * Math.PI) / 180;
  const rad2 = (theta2 * Math.PI) / 180;

  const joint1 = { x: dx, y: dy };
  const joint2 = {
    x: dx + L1 * Math.cos(rad1),
    y: dy + L1 * Math.sin(rad1),
  };
  const endEffector = {
    x: joint2.x + L2 * Math.cos(rad1 + rad2),
    y: joint2.y + L2 * Math.sin(rad1 + rad2),
  };

  const distToTarget = Math.sqrt(
    Math.pow(endEffector.x - target.x, 2) + Math.pow(endEffector.y - target.y, 2)
  );
  const isSuccess = distToTarget < 0.5;

  const p0 = toScreen(0, 0);
  const p1 = toScreen(joint1.x, joint1.y);
  const p2 = toScreen(joint2.x, joint2.y);
  const p3 = toScreen(endEffector.x, endEffector.y);
  const pTarget = toScreen(target.x, target.y);

  return (
    <div className="bg-slate-900 rounded-2xl p-8 text-white shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="text-red-500" /> Practice Simulation
          </h2>
          <p className="text-slate-400 mt-1">Move the robot arm to touch the apple.</p>
        </div>
        <button
          onClick={randomizeTarget}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg transition-colors border border-slate-700"
        >
          <RefreshCw size={16} /> New Target
        </button>
      </div>

      <div className="mb-8 bg-slate-800 p-6 rounded-xl border border-slate-700 overflow-x-auto">
        <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Forward Kinematics</h3>
        <BlockMath math="X = \begin{bmatrix} x \\ y \end{bmatrix} = \begin{bmatrix} d_x \\ d_y \end{bmatrix} + \begin{bmatrix} L_1\cos\theta_1 + L_2\cos(\theta_1+\theta_2) \\ L_1\sin\theta_1 + L_2\sin(\theta_1+\theta_2) \end{bmatrix}" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Base Position</h3>
            <SliderInput label="dx" value={dx} onChange={setDx} min={-5} max={5} />
            <div className="h-4" />
            <SliderInput label="dy" value={dy} onChange={setDy} min={-5} max={5} />
          </div>

          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
            <h3 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Joint Angles</h3>
            <SliderInput label="θ1 (deg)" value={theta1} onChange={setTheta1} min={-180} max={180} step={1} />
            <div className="h-4" />
            <SliderInput label="θ2 (deg)" value={theta2} onChange={setTheta2} min={-180} max={180} step={1} />
          </div>

          <div className={`p-4 rounded-xl border ${isSuccess ? 'bg-emerald-900/50 border-emerald-500' : 'bg-slate-800 border-slate-700'}`}>
            <h3 className="font-semibold mb-2">{isSuccess ? '🎉 Target Reached!' : 'Status'}</h3>
            <p className="text-sm text-slate-300">
              Distance to target: <span className="font-mono">{distToTarget.toFixed(2)}</span> units
            </p>
          </div>
        </div>

        <div className="lg:col-span-2 flex items-center justify-center bg-slate-950 p-4 rounded-xl border border-slate-800 overflow-hidden relative">
          <svg width={SVG_WIDTH + 100} height={SVG_HEIGHT + 100} viewBox="-50 -50 500 500">
            <defs>
              <marker id="arrowhead-X" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
              </marker>
              <marker id="arrowhead-x-local" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#0ea5e9" />
              </marker>
              <marker id="arrowhead-d" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
              </marker>
            </defs>
            <CoordinateSystem />
            
            {/* Workspace boundary */}
            <circle
              cx={ORIGIN_X}
              cy={ORIGIN_Y}
              r={rMax * SCALE}
              fill="none"
              stroke="#334155"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
            
            {/* Target Apple */}
            <g transform={`translate(${pTarget.x}, ${pTarget.y})`}>
              <circle cx="0" cy="0" r="8" fill="#ef4444" />
              <path d="M 0 -8 Q 2 -12 6 -10" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" />
            </g>

            {/* Base Translation d */}
            {dx !== 0 || dy !== 0 ? (
              <g>
                <line x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke="#64748b" strokeWidth="3" strokeDasharray="5 5" markerEnd="url(#arrowhead-d)" />
                <text x={(p0.x + p1.x)/2 - 14} y={(p0.y + p1.y)/2 - 14} fill="#64748b" fontSize="18" fontWeight="bold" fontStyle="italic">d</text>
              </g>
            ) : null}

            {/* Local Vector x (to target) */}
            <g>
              <line x1={p2.x} y1={p2.y} x2={pTarget.x} y2={pTarget.y} stroke="#0ea5e9" strokeWidth="3" strokeDasharray="5 5" markerEnd="url(#arrowhead-x-local)" />
              <text x={(p2.x + pTarget.x)/2 - 14} y={(p2.y + pTarget.y)/2 - 14} fill="#0ea5e9" fontSize="18" fontWeight="bold" fontStyle="italic">x</text>
            </g>

            {/* Global Vector X (to target) */}
            <g>
              <line x1={p0.x} y1={p0.y} x2={pTarget.x} y2={pTarget.y} stroke="#f59e0b" strokeWidth="3" strokeDasharray="7 7" markerEnd="url(#arrowhead-X)" />
              <text x={(p0.x + pTarget.x)/2 + 14} y={(p0.y + pTarget.y)/2 + 20} fill="#f59e0b" fontSize="18" fontWeight="bold" fontStyle="italic">X</text>
            </g>

            {/* Angle References and Arcs */}
            <line x1={p1.x} y1={p1.y} x2={p1.x + 40} y2={p1.y} stroke="#94a3b8" strokeWidth="2" strokeDasharray="2 2" />
            <AngleArc cx={p1.x} cy={p1.y} startAngle={0} angle={rad1} radius={30} color="#3b82f6" label="θ₁" />
            
            <line x1={p2.x} y1={p2.y} x2={p2.x + 40 * Math.cos(rad1)} y2={p2.y - 40 * Math.sin(rad1)} stroke="#94a3b8" strokeWidth="2" strokeDasharray="2 2" />
            <AngleArc cx={p2.x} cy={p2.y} startAngle={rad1} angle={rad2} radius={25} color="#8b5cf6" label="θ₂" />

            {/* Link 1 */}
            <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#3b82f6" strokeWidth="9" strokeLinecap="round" />
            
            {/* Link 2 */}
            <line x1={p2.x} y1={p2.y} x2={p3.x} y2={p3.y} stroke="#8b5cf6" strokeWidth="7" strokeLinecap="round" />
            
            {/* Joints */}
            <circle cx={p1.x} cy={p1.y} r="7" fill="#f8fafc" stroke="#334155" strokeWidth="2.5" />
            <circle cx={p2.x} cy={p2.y} r="6" fill="#f8fafc" stroke="#334155" strokeWidth="2.5" />
            
            {/* End Effector */}
            <circle cx={p3.x} cy={p3.y} r="5" fill="#f8fafc" stroke="#ef4444" strokeWidth="2.5" />
            
            {/* Success Highlight */}
            {isSuccess && (
              <circle cx={p3.x} cy={p3.y} r="14" fill="none" stroke="#22c55e" strokeWidth="3" className="animate-ping" />
            )}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            2D Robot Kinematics Fundamentals
          </h1>
          <p className="mt-2 text-slate-600 max-w-3xl">
            Learn how translation, rotation, and combined transformations affect the position of a robotic manipulator using standard linear algebra formulations.
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <SectionTranslation />
        <hr className="border-slate-200 my-16" />
        <SectionRotation />
        <hr className="border-slate-200 my-16" />
        <SectionRigidBody />
        <hr className="border-slate-200 my-16" />
        <PracticeSimulation />
      </main>
    </div>
  );
}
