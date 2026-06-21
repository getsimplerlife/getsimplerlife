export interface SdrInput {
  prospectName: string;
  companyName: string;
  inboundMessage: string;
}

export interface SdrResponse {
  success: boolean;
  draftedReply: string;
  sentiment: 'positive' | 'neutral' | 'questioning' | 'negative';
  suggestedAction: string;
  meetingLink: string;
}

export const simulateSdrReply = (input: SdrInput): SdrResponse => {
  const { prospectName, companyName, inboundMessage } = input;
  const lowerMsg = inboundMessage.toLowerCase();
  
  let sentiment: 'positive' | 'neutral' | 'questioning' | 'negative' = 'neutral';
  let suggestedAction = 'Follow up with pricing details';
  let draftedReply = '';
  const meetingLink = `https://cal.com/simplerlife/${prospectName.toLowerCase().replace(/\s+/g, '-')}`;

  if (lowerMsg.includes('yes') || lowerMsg.includes('interested') || lowerMsg.includes('want to buy') || lowerMsg.includes('love to see')) {
    sentiment = 'positive';
    suggestedAction = 'Schedule calendar invite directly';
  } else if (lowerMsg.includes('how much') || lowerMsg.includes('cost') || lowerMsg.includes('pricing') || lowerMsg.includes('quote')) {
    sentiment = 'questioning';
    suggestedAction = 'Send standard pricing tier sheet';
  } else if (lowerMsg.includes('no') || lowerMsg.includes('not interested') || lowerMsg.includes('remove') || lowerMsg.includes('stop')) {
    sentiment = 'negative';
    suggestedAction = 'Opt out from future sequences';
  }

  // Draft customized response copy
  if (sentiment === 'positive') {
    draftedReply = `Hi ${prospectName},\n\nThat's fantastic to hear! I'd love to show you how Simpler Life can help automate operations at ${companyName}. \n\nLet's schedule a brief 15-minute introductory call. You can grab a spot directly on my calendar here: ${meetingLink}\n\nLooking forward to speaking!\n\nBest regards,\nCarol\nSales Development Representative | Simpler Life`;
  } else if (sentiment === 'questioning') {
    draftedReply = `Hi ${prospectName},\n\nThanks for reaching out! Regarding pricing for ${companyName}, our custom SMB automation workflows typically start at $150/month with zero upfront setup fees. \n\nTo give you a precise quote tailored to your actual requirements, let's hop on a brief call: ${meetingLink}\n\nDoes any slot this week work for you?\n\nBest regards,\nCarol\nSales Development Representative | Simpler Life`;
  } else if (sentiment === 'negative') {
    draftedReply = `Hi ${prospectName},\n\nUnderstood completely. I have updated our CRM to ensure you won't receive any further outreach from ${companyName}. If anything changes, feel free to reach out anytime.\n\nBest of luck,\nCarol\nSales Development Representative | Simpler Life`;
  } else {
    draftedReply = `Hi ${prospectName},\n\nThank you for the reply. I'd love to learn more about the current operational bottlenecks you are experiencing at ${companyName} and see if we can help simplify your processes.\n\nIf you have 10 minutes, you can book a chat with us here: ${meetingLink}\n\nHave a great day!\n\nBest regards,\nCarol\nSales Development Representative | Simpler Life`;
  }

  return {
    success: true,
    draftedReply,
    sentiment,
    suggestedAction,
    meetingLink
  };
};
