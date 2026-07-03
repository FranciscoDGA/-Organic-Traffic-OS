export class PublishingValidator {
  public validatePackage(pack: any) {
    return pack.document && pack.manifest && pack.manifest.checksum;
  }
}
