import { PublishingEngine } from './publishing-engine';
import { PublishingValidator } from '../validators/publishing-validator';

export class PublishingService {
  private engine = new PublishingEngine();
  private validator = new PublishingValidator();

  public prepare(data: any) {
    const { asset, visibility, strategy, format } = data;
    const pack = this.engine.preparePackage(asset, visibility, strategy, format);
    this.validator.validatePackage(pack);
    return pack;
  }

  public listPackages() {
    return [
      { id: "pkg-1", content_id: "cid-123", titulo: "Guia Concursos", format: "markdown", status: "prepared", destino: "Export" },
      { id: "pkg-2", content_id: "cid-456", titulo: "FAQ Cumaru", format: "wordpress", status: "prepared", destino: "WordPress" }
    ];
  }

  public getPackage(id: string) {
    return { id, status: "prepared", checksum: "hash" };
  }
}
