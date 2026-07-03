import { TrendData, TrendDirection, ReportPeriod } from './reliability.types';

function randomDelta(): number { return (Math.random() - 0.5) * 20; }
function determineDirection(change: number): TrendDirection { return change > 2 ? 'improving' : change < -2 ? 'degrading' : 'stable'; }

const metrics = ['uptime', 'availability', 'errorRate', 'avgLatency', 'mtbf', 'mttr', 'throughput', 'costGrowth', 'resourceUtilization'];

export function generateTrends(period: ReportPeriod): TrendData[] {
  return metrics.map(metric => {
    const current = metric === 'errorRate' ? Math.random() * 3 : metric === 'costGrowth' ? Math.random() * 15 : 70 + Math.random() * 30;
    const change = randomDelta();
    const previous = current - change;
    return { metric, current: parseFloat(current.toFixed(1)), previous: parseFloat(previous.toFixed(1)), change: parseFloat(change.toFixed(1)), direction: determineDirection(change), period };
  });
}
