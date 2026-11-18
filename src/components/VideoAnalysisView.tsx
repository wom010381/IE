import React, { useState, useRef } from 'react';
import { VideoObservation, TaskElement } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  Flag,
  AlertTriangle,
  Plus,
  Clock,
  Film,
  CheckCircle2,
} from 'lucide-react';

interface VideoAnalysisViewProps {
  observations: VideoObservation[];
  elements: TaskElement[];
  onAddObservation: (obs: VideoObservation) => void;
}

export const VideoAnalysisView: React.FC<VideoAnalysisViewProps> = ({
  observations,
  elements,
  onAddObservation,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);

  // Marker Capture Form
  const [selectedElementId, setSelectedElementId] = useState<string>(elements[0]?.id || '');
  const [startTime, setStartTime] = useState<number>(0);
  const [endTime, setEndTime] = useState<number>(0);
  const [cycleNumber, setCycleNumber] = useState<number>(1);
  const [isAbnormal, setIsAbnormal] = useState<boolean>(false);
  const [abnormalReason, setAbnormalReason] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  const handleStep = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime + seconds);
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const markStart = () => {
    const t = Number(currentTime.toFixed(2));
    setStartTime(t);
  };

  const markEnd = () => {
    const t = Number(currentTime.toFixed(2));
    setEndTime(t);
  };

  const duration = Math.max(0, Number((endTime - startTime).toFixed(2)));

  const handleSaveObservation = (e: React.FormEvent) => {
    e.preventDefault();
    if (endTime <= startTime) {
      alert('End time must be greater than start time.');
      return;
    }

    const matchedElement = elements.find((el) => el.id === selectedElementId);

    const newObs: VideoObservation = {
      id: `vid-obs-${Date.now()}`,
      projectId: 'WSP-2026-001',
      videoUrl: videoRef.current?.src || '',
      videoTitle: 'Line 4 Terminal Insertion Video Study',
      workstation: matchedElement?.workstation || 'ST-01 Terminal Insertion 1',
      operatorName: 'Elena Rostova (ID 104)',
      processStep: matchedElement?.operationName || 'Terminal Insertion',
      studyDate: new Date().toISOString().split('T')[0],
      elementId: selectedElementId,
      startTime,
      endTime,
      duration,
      cycleNumber,
      isAbnormal,
      abnormalReason: isAbnormal ? abnormalReason : undefined,
      notes: notes || 'Recorded via video time-study interface',
    };

    onAddObservation(newObs);
    // Reset marker end for next cycle
    setStartTime(endTime);
    setEndTime(0);
    setIsAbnormal(false);
    setAbnormalReason('');
    setNotes('');
    setCycleNumber((c) => c + 1);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">Video-Based Work Study &amp; Motion Analysis</h2>
        <p className="text-xs text-slate-500">
          Timestamp-based frame-by-frame elemental time measurement with abnormal cycle segregation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Video Player Column (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-lg overflow-hidden shadow-xs space-y-3 p-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-slate-900">WH-ENG-8402 Line 4 Cycle Recording</span>
            </div>
            <span className="text-[11px] text-slate-400 font-mono">1080p @ 30fps</span>
          </div>

          {/* HTML5 Video Element */}
          <div className="relative aspect-video bg-black rounded overflow-hidden flex items-center justify-center">
            <video
              ref={videoRef}
              src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4"
              className="w-full h-full object-contain"
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
            />
            {/* Live Timestamp Overlay */}
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-white font-mono text-xs px-2.5 py-1 rounded shadow">
              Time: {currentTime.toFixed(2)}s
            </div>
            {/* Playback speed indicator */}
            <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-xs text-white font-mono text-xs px-2 py-1 rounded shadow">
              {playbackSpeed}x Speed
            </div>
          </div>

          {/* Video Scrub Timeline */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-500">
              <span>{currentTime.toFixed(2)}s</span>
              <span>Duration: 180.00s</span>
            </div>
            <input
              type="range"
              min="0"
              max="180"
              step="0.05"
              value={currentTime}
              onChange={(e) => {
                const t = parseFloat(e.target.value);
                setCurrentTime(t);
                if (videoRef.current) videoRef.current.currentTime = t;
              }}
              className="w-full accent-blue-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
            />
          </div>

          {/* Playback Controls Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-1.5">
              <button
                onClick={togglePlay}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-xs"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                onClick={() => handleStep(-0.1)}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-mono"
                title="Step backward 0.1s"
              >
                -0.1s
              </button>
              <button
                onClick={() => handleStep(0.1)}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs font-mono"
                title="Step forward 0.1s"
              >
                +0.1s
              </button>
            </div>

            {/* Playback Rate Buttons */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 text-[11px] mr-1">Speed:</span>
              {[0.25, 0.5, 1.0, 1.5, 2.0].map((rate) => (
                <button
                  key={rate}
                  onClick={() => handleSpeedChange(rate)}
                  className={`px-2 py-1 rounded font-mono text-[11px] ${
                    playbackSpeed === rate
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {rate}x
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Capture Tool Column (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-4">
          <div className="pb-3 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900">Timestamp Capture &amp; Observation Log</h3>
            <p className="text-xs text-slate-500">Record start, end, and duration directly from video playback.</p>
          </div>

          <form onSubmit={handleSaveObservation} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-slate-700 mb-1">Target Task Element</label>
              <select
                value={selectedElementId}
                onChange={(e) => setSelectedElementId(e.target.value)}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium text-slate-900"
              >
                {elements.map((el) => (
                  <option key={el.id} value={el.id}>
                    {el.elementCode}: {el.operationName}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Start Time (sec)</label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    step="0.01"
                    value={startTime}
                    onChange={(e) => setStartTime(parseFloat(e.target.value) || 0)}
                    className="w-full border border-slate-300 rounded px-2 py-1.5 font-mono text-slate-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={markStart}
                    className="px-2.5 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded font-medium text-xs whitespace-nowrap"
                  >
                    Mark
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">End Time (sec)</label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    step="0.01"
                    value={endTime}
                    onChange={(e) => setEndTime(parseFloat(e.target.value) || 0)}
                    className="w-full border border-slate-300 rounded px-2 py-1.5 font-mono text-slate-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={markEnd}
                    className="px-2.5 py-1.5 bg-blue-100 text-blue-700 hover:bg-blue-200 rounded font-medium text-xs whitespace-nowrap"
                  >
                    Mark
                  </button>
                </div>
              </div>
            </div>

            {/* Duration Display */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-500 block">Calculated Duration</span>
                <span className="text-base font-bold font-mono text-slate-900">{duration.toFixed(2)} seconds</span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-500 block">Cycle Number</span>
                <input
                  type="number"
                  min="1"
                  value={cycleNumber}
                  onChange={(e) => setCycleNumber(parseInt(e.target.value) || 1)}
                  className="w-16 border border-slate-300 rounded px-2 py-0.5 font-mono text-right"
                />
              </div>
            </div>

            {/* Abnormal Condition Toggle */}
            <div className="p-3 bg-amber-50/70 border border-amber-200 rounded space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAbnormal}
                  onChange={(e) => setIsAbnormal(e.target.checked)}
                  className="rounded text-amber-600 focus:ring-amber-500"
                />
                <span className="font-semibold text-amber-900 text-xs flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Flag as Abnormal / Outlier Cycle
                </span>
              </label>

              {isAbnormal && (
                <div>
                  <label className="block text-[11px] text-amber-800 font-medium mb-1">
                    Exclusion Justification (Rule 4.2 Mandatory) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wire snagged on jig pin; tool dropped on floor"
                    value={abnormalReason}
                    onChange={(e) => setAbnormalReason(e.target.value)}
                    className="w-full bg-white border border-amber-300 rounded px-2.5 py-1.5 focus:outline-none"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block font-medium text-slate-700 mb-1">Observation Notes</label>
              <input
                type="text"
                placeholder="e.g. Good rhythm, smooth secondary lock engagement"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full border border-slate-300 rounded px-2.5 py-1.5 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Record &amp; Transfer to Time Study</span>
            </button>
          </form>
        </div>
      </div>

      {/* Recorded Video Observations Table */}
      <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <h3 className="text-sm font-bold text-slate-900">
            Recorded Video Observations ({observations.length})
          </h3>
          <span className="text-xs text-slate-500">Traceable video time-study evidence</span>
        </div>

        <div className="table-responsive overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
              <tr>
                <th className="py-2.5 px-3">Cycle #</th>
                <th className="py-2.5 px-3">Workstation / Element</th>
                <th className="py-2.5 px-3">Operator</th>
                <th className="py-2.5 px-3">Time Interval</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3">Condition</th>
                <th className="py-2.5 px-3">Engineering Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {observations.map((obs) => {
                const el = elements.find((e) => e.id === obs.elementId);
                return (
                  <tr key={obs.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">#{obs.cycleNumber}</td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-800">{el ? `${el.elementCode}: ${el.operationName}` : obs.processStep}</div>
                      <div className="text-[11px] text-slate-400">{obs.workstation}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">{obs.operatorName}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">
                      {obs.startTime.toFixed(2)}s &rarr; {obs.endTime.toFixed(2)}s
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      {obs.duration.toFixed(2)}s
                    </td>
                    <td className="py-2.5 px-3">
                      {obs.isAbnormal ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                          <AlertTriangle className="w-3 h-3" /> Abnormal
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" /> Valid
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 max-w-xs truncate">
                      {obs.isAbnormal ? obs.abnormalReason : obs.notes}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
