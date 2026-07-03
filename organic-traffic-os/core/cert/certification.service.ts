import { OperationalCertificate } from './certification.types';
import { certificationEngine } from './certification-engine';

class CertificationService {
  private engine = certificationEngine;

  run(): OperationalCertificate { return this.engine.runCertification(); }
  retest(): OperationalCertificate { return this.engine.runCertification(); }
  getLatest(): OperationalCertificate | undefined { return this.engine.getLatest(); }
  getAll(): OperationalCertificate[] { return this.engine.getAll(); }
  getCertificate(id: string): OperationalCertificate | undefined { return this.engine.getCertificate(id); }
  approveGoLive(id: string): boolean { return this.engine.approveGoLive(id); }
  getReadiness() {
    const latest = this.engine.getLatest();
    if (!latest) return { status: 'pending', score: 0, level: 'pending', authorized: false };
    return { status: 'completed', score: latest.overallScore.overall, level: latest.overallScore.level, authorized: latest.overallScore.overall >= 70 };
  }
}

export const certificationService = new CertificationService();
