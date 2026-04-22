const HUBSPOT_TOKEN = process.env.REACT_APP_HUBSPOT_ACCESS_TOKEN;
const HUBSPOT_API = 'https://api.hubapi.com';

const headers = {
  'Authorization': `Bearer ${HUBSPOT_TOKEN}`,
  'Content-Type': 'application/json',
};

export async function createHubSpotContact(leadData) {
  if (!HUBSPOT_TOKEN) return null;
  try {
    const response = await fetch(`${HUBSPOT_API}/crm/v3/objects/contacts`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        properties: {
          firstname: leadData.firstName,
          lastname: leadData.lastName || '',
          phone: leadData.phone,
          email: leadData.email || '',
          hs_lead_status: 'NEW',
          lifecyclestage: 'lead',
        },
      }),
    });
    if (!response.ok) return null;
    const contact = await response.json();
    await createHubSpotDeal(contact.id, leadData);
    return contact.id;
  } catch (err) {
    console.error('HubSpot error:', err);
    return null;
  }
}

async function createHubSpotDeal(contactId, leadData) {
  try {
    await fetch(`${HUBSPOT_API}/crm/v3/objects/deals`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        properties: {
          dealname: `${leadData.firstName} ${leadData.lastName || ''} — ${leadData.serviceType}`,
          dealstage: 'appointmentscheduled',
          pipeline: 'default',
        },
        associations: [{
          to: { id: contactId },
          types: [{ associationCategory: 'HUBSPOT_DEFINED', associationTypeId: 3 }]
        }]
      }),
    });
  } catch (err) {
    console.error('HubSpot deal error:', err);
  }
}
