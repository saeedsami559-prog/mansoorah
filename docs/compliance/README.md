# Real-business readiness – launch checklist (Oman)

A practical checklist for turning the Mansoorah prototype into a registered Omani business.
Only official sources are linked. **Link status** was checked on 24 Nov 2026 from an overseas cloud server; several Omani government portals refuse or redirect such traffic, so those are marked **verify** – open them from Oman to confirm.
Where a fee or requirement is not confirmed by an official page we write **check on the official portal**. We tried to download official guides/forms as PDFs into this folder, but none of the portals could be fetched automatically; download them manually from the links below.

| Portal | URL | Link status |
|---|---|---|
| Oman Business Platform (MoCIIP) | https://www.business.gov.om | verify (redirects) |
| Maroof Oman | https://www.maroof.om | verify (no response) |
| Consumer Protection Authority | https://www.cpa.gov.om | verify (404 from our network) |
| Ministry of Transport, Communications and IT | https://www.mtcit.gov.om | reachable |
| SME Development Authority (Riyada) | https://www.riyada.om | reachable |
| Ministry of Labour | https://www.mol.gov.om | reachable |
| Oman Tax Authority – Tax Management System | https://tms.taxoman.gov.om | reachable |

---

## 1. Commercial registration and licences
Ministry of Commerce, Industry and Investment Promotion (MoCIIP) via the **Oman Business Platform** – https://www.business.gov.om

- [ ] Create an account on the platform.
- [ ] Reserve the trade name (up to three proposals, e.g. “Mansoorah”, “Mansoorah Smart Services”, “Mansoorah Tech”).
- [ ] Choose activities: online platform / e-commerce **and** installation and maintenance services.
- [ ] Issue the Commercial Registration (CR). Fees: **check on the official portal**.
- [ ] Obtain the e-commerce activity licence through the platform.
- [ ] Use the platform’s investment guide / licence simulator to confirm the exact licences for each activity.
- [ ] Replace “Commercial registration: in progress” in the site footer with the real CR number.

## 2. E-store verification
- [ ] Register the website on **Maroof Oman** (https://www.maroof.om) and link it to the CR, as MoCIIP requires for e-commerce activities.
- [ ] Add the Maroof badge to the footer only **after** approval.

## 3. Consumer protection
Consumer Protection Law and its Executive Regulations (Article 33 obligations for online sellers). Authority: https://www.cpa.gov.om (verify).
- [ ] Clear prices (done: fixed OMR prices on every service page).
- [ ] Seller identity and contact details on the site (add CR number, real phone, e-mail, address).
- [ ] Terms of use (draft at `/terms`).
- [ ] Cancellation and refund policy (draft at `/cancellation-refund`; set the late-cancellation fee before launch).
- [ ] Complaint handling process and response time.

## 4. Personal data
Personal Data Protection Law – **Royal Decree 6/2022**; Executive Regulations – **Ministerial Decision 34/2024**; overseen by the **Ministry of Transport, Communications and Information Technology** (https://www.mtcit.gov.om). The transition period ended and the law became fully enforceable on **5 February 2026**.
- [ ] Explicit consent before collecting personal data (consent lines exist under every form; add a real consent checkbox when a backend is added).
- [ ] Clear privacy notice (draft at `/privacy`).
- [ ] Data-subject rights process (access, correction, deletion, withdrawal of consent).
- [ ] Security controls (encryption, access control, licensed processors).
- [ ] Breach-handling procedure and notification.
- [ ] Any registration/permit obligations for processing: **check on the official portal**.

## 5. SME support
- [ ] Register with the **SME Development Authority (Riyada)** – https://www.riyada.om.
- [ ] Apply for the **Entrepreneurship (Riyada) Card**. It is issued online; the official service page lists a yearly fee of 5 OMR and requires the business to be registered with the Authority. The card gives access to government and private-sector facilities and is relevant to Omanisation grace periods.

## 6. Ministry of Labour (https://www.mol.gov.om)
- [ ] **Omanisation:** every CR that has completed one year must appoint at least one Omani employee. Entrepreneurs and full-time owners get a one-year grace period, with case-by-case review. The founders are Omani – plan for this before month 12.
- [ ] **Technicians** join as independent self-employed Omanis, which matches the national push to formalise freelance work. Check with the Ministry whether any listed installation trade later requires a professional practice licence or classification certificate. (Ministry of Labour licensing currently targets specific sectors: energy and minerals, logistics, finance, industry.)
- [ ] Labour Law: **Royal Decree 53/2023**.

## 7. Tax
Oman Tax Authority – https://tms.taxoman.gov.om
- VAT is **5%**. Registration is mandatory above **38,500 OMR** of annual taxable supplies and voluntary above **19,250 OMR**.
- The year-1 forecast (about 7,000 OMR revenue) is below both thresholds, so **no VAT is charged** (the site says so next to every total).
- [ ] Review turnover monthly; register and update prices/receipts before crossing the mandatory threshold.

## 8. Payments
- [ ] Integrate only licensed Omani payment gateways (Thawani, OmanNet via a bank acquirer) when going live.
- [ ] Never store card data on Mansoorah systems (hosted checkout only).
- [ ] Remove the “Demo – no real payment is taken” labels only after go-live testing.

## 9. Technician agreements
- [ ] Written agreement covering: responsibilities, conduct in homes, the 7-day warranty, the 15%–20% commission, the Pro plan (5 OMR/month), payouts, and data handling.
- [ ] Keep ID and background-check evidence securely, with limited access and a retention period.
- [ ] Replace the fictional technician profiles with real, consented profiles (and real photos only with written consent).
