import { Opportunity, MissionProposal } from './opportunity.types';
import { detectOpportunities, getOpportunityById } from './opportunity-detector';
import { rankOpportunities } from './opportunity-scorer';
import { buildMissionProposal } from './mission-proposal-builder';

const proposals: MissionProposal[] = [];

export function getOpportunityService() {
  return {
    detect() { return detectOpportunities(); },
    getRanking() { return rankOpportunities(detectOpportunities()); },
    getById(id: string) { return getOpportunityById(id); },
    getProposals() { return proposals; },
    approve(id: string) {
      const p = proposals.find(x => x.id === id);
      if (p) p.status = 'approved';
      return p;
    },
    reject(id: string) {
      const p = proposals.find(x => x.id === id);
      if (p) p.status = 'rejected';
      return p;
    },
    analyzeAndPropose() {
      const opps = rankOpportunities(detectOpportunities());
      const newProposals = opps.slice(0, 3).map(o => {
        const prop = buildMissionProposal(o);
        proposals.push(prop);
        return prop;
      });
      return { opportunities: opps, proposals: newProposals };
    },
  };
}
