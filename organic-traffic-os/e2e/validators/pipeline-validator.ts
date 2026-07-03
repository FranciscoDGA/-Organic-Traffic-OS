export class PipelineValidator {
  public validateChain(stages: string[]) {
    return stages.length === 23;
  }
  public validateArtifacts(artifacts: any[]) {
    return artifacts.every(a => a.checksum);
  }
}
