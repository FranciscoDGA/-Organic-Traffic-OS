export const connectorHub = {
  getAllConnectors(): any[] {
    return [];
  },
  getConnector(_id: string): any {
    return null;
  },
  healthCheck(_id: string): any {
    return { status: 'ok' };
  },
};
