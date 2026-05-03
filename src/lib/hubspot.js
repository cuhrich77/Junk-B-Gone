export async function createHubSpotContact(leadData) {
  try {
    const res = await fetch('/api/hubspot', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contactData: {
          firstname: leadData.firstName || '',
          lastname: leadData.lastName || '',
          phone: leadData.phone || '',
          email: leadData.email || '',
          hs_lead_status: 'NEW',
          lifecyclestage: 'lead',
        },
        dealData: {
          dealname: `${leadData.firstName || ''} ${leadData.lastName || ''} — ${leadData.serviceType || leadData.service || ''}`,
          dealstage: 'appointmentscheduled',
          pipeline: 'default',
          description: leadData.message || '',
        },
      }),
    });
    const data = await res.json();
    return data.contactId || null;
  } catch (err) {
    console.error('HubSpot error:', err);
    return null;
  }
}
