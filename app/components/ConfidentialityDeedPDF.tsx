import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    paddingBottom: 80,
    fontFamily: "Times-Roman",
    fontSize: 11,
    lineHeight: 1.5,
    color: "#1f2937",
  },
  titlePage: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
  },
  titleLogo: {
    width: 200,
    marginBottom: 40,
  },
  titleText: {
    marginBottom: 24,
    fontSize: 11,
  },
  partyName: {
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 24,
  },
  titleDivider: {
    width: 400,
    height: 1,
    backgroundColor: "#9ca3af",
    marginVertical: 24,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: "bold",
    letterSpacing: 2,
    marginVertical: 24,
  },
  h1: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#bb964c",
    letterSpacing: 0.5,
  },
  h2: {
    fontSize: 15,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 8,
    color: "#bb964c",
  },
  h3: {
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 6,
    color: "#bb964c",
  },
  paragraph: {
    marginBottom: 8,
    textAlign: "justify",
  },
  bold: {
    fontWeight: "bold",
  },
  list: {
    marginLeft: 30,
    marginBottom: 8,
  },
  listItem: {
    marginBottom: 6,
    textAlign: "justify",
    flexDirection: "row",
  },
  signatureSection: {
    marginTop: 40,
  },
  signatureBox: {
    border: "2px solid #d1d5db",
    padding: 10,
    marginVertical: 15,
    textAlign: "center",
    width: 150,
    fontSize: 9,
  },
  signatureImage: {
    width: 130,
    height: 130,
    marginHorizontal: "auto",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    paddingHorizontal: 40,
    paddingBottom: 10,
  },
  footerLine: {
    width: "100%",
    height: 3,
    backgroundColor: "#bb964c",
  },
  watermark: {
    position: "absolute",
    bottom: 100,
    right: 20,
    width: 450,
    opacity: 0.25,
  },
});

interface ConfidentialityDeedPDFProps {
  companyName: string;
  acn: string;
  street: string;
  state: string;
  postcode: string;
  repName: string;
  email: string;
  deedDate: string;
  signatureBase64: string;
  sig1Base64: string;
  sig2Base64: string;
  logoBase64: string;
}

const ConfidentialityDeedPDF: React.FC<ConfidentialityDeedPDFProps> = ({
  companyName,
  acn,
  street,
  state,
  postcode,
  repName,
  email,
  deedDate,
  signatureBase64,
  sig1Base64,
  sig2Base64,
  logoBase64,
}) => (
  <Document>
    {/* Title Page */}
    <Page size="A4" style={styles.titlePage}>
      <Image src={logoBase64} style={styles.titleLogo} />
      <Text style={styles.titleText}>Between</Text>
      <Text style={styles.partyName}>Load Link Australia Pty Limited</Text>
      <Text style={styles.partyName}>and AJK ENGINES PTY LIMITED</Text>
      <Text style={styles.titleText}>and</Text>
      <Text style={[styles.partyName, { textTransform: "uppercase" }]}>
        {companyName}
      </Text>
      <View style={styles.titleDivider} />
      <Text style={styles.mainTitle}>CONFIDENTIALITY DEED</Text>
      <View style={styles.titleDivider} />
      <Text style={[styles.titleText, { marginTop: 30 }]}>{deedDate}</Text>
    </Page>

    {/* Main Content */}
    <Page size="A4" style={styles.page}>
      {/* Watermark */}
      <Image src={logoBase64} style={styles.watermark} fixed />

      {/* Footer */}
      <View style={styles.footer} fixed>
        <View style={styles.footerLine} />
      </View>

      <Text style={styles.h1}>CONFIDENTIALITY DEED</Text>

      <Text style={styles.paragraph}>
        THIS DEED is made the day of <Text style={styles.bold}>{deedDate}</Text>
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>BETWEEN:</Text> LOAD LINK AUSTRALIA PTY
        LIMITED (ACN 661 824 175) of Unit 44/211 Brisbane Road Biggera Waters,
        Queensland 4216 and AJK ENGINES PTY LIMITED (ACN 789 632 145) of Unit
        44/211 Brisbane Road Biggera Waters, Queensland 4216, ("Disclosing
        Party"); and <Text style={styles.bold}>{companyName}</Text> (ACN {acn})
        of {street}, {state} {postcode} ("Recipient").
      </Text>

      <Text style={styles.h2}>WHEREAS:</Text>
      <Text style={styles.paragraph}>
        A. The Disclosing Party and the Recipient wish to pursue discussions
        concerning possible transactions between them and to that end it is
        necessary for the Disclosing Party to provide certain Confidential
        Information to the Recipient.
      </Text>
      <Text style={styles.paragraph}>
        B. The Confidential Information is of significant commercial value to
        the Disclosing Party.
      </Text>
      <Text style={styles.paragraph}>
        C. The Disclosing Party proposes to make the Confidential Information
        available to the Recipient for the Permitted Purpose subject to and in
        consideration of the Recipient entering into this Deed.
      </Text>

      <Text style={styles.h2}>NOW THIS DEED WITNESSES as follows:</Text>

      <Text style={styles.h3}>1. DEFINITIONS AND INTERPRETATIONS</Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>1.1 Definitions</Text>
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>"Beneficiaries"</Text> means the Disclosing
        Party and each of its Related Bodies Corporate who have an interest in,
        or who are the subject of, any of the Confidential Information.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>"Confidential Information"</Text> means:
      </Text>

      <View style={styles.list}>
        <Text style={styles.listItem}>
          • All commercial, financial, legal and technical information and
          know-how directly or indirectly related to the business or affairs of
          the Disclosing Party or its Related Bodies Corporate which is
          disclosed (whether orally, electronically, in writing or any other
          form or media whatsoever) by or on behalf of the Disclosing Party to
          the Recipient or any of its Representatives and includes, without
          limitation, all documents at any time contained in any Data Room;
        </Text>
        <Text style={styles.listItem}>
          • The contents of any discussions or agreements between the parties
          and/or their Related Bodies Corporate relating to a Permitted
          Transaction;
        </Text>
        <Text style={styles.listItem}>• Derived Information;</Text>
        <Text style={styles.listItem}>
          • The terms and conditions and existence of this Deed;
        </Text>
        <Text style={styles.listItem}>
          • The fact that discussions have already occurred between the parties
          in relation to a possible Permitted Transaction and that further such
          discussions may occur in the future;
        </Text>
        <Text style={styles.listItem}>
          • The fact that the Disclosing Party has disclosed or may disclose
          information to the Recipient pursuant to this Deed;
        </Text>
      </View>

      <Text style={styles.paragraph}>But does not include information:</Text>

      <View style={styles.list}>
        <Text style={styles.listItem}>
          • Which at the time of first disclosure to the Recipient is in the
          public domain;
        </Text>
        <Text style={styles.listItem}>
          • Which after disclosure to the Recipient comes into the public domain
          otherwise than by disclosure in breach of the terms of this Deed;
        </Text>
        <Text style={styles.listItem}>
          • Which was known to or by the Recipient at the time of first
          disclosure to it and was not acquired directly or indirectly from the
          Disclosing Party;
        </Text>
        <Text style={styles.listItem}>
          • Which the Recipient receives from a third party, provided that as
          far as the Recipient is aware (without the need for enquiry) the
          information was not obtained directly or indirectly from the
          Disclosing Party in breach of an obligation of confidence owed by the
          third party to the Disclosing Party or any other person.
        </Text>
      </View>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>"Derived Information"</Text> means any note,
        calculation, conclusion, summary or other material derived or produced
        partly or wholly from any Confidential Information.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>"document"</Text> has the meaning given to it
        in Section 9 of the Corporations Law.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>"Related Bodies Corporate"</Text> has the
        meaning given to it in Section 50 of the Corporations Law.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>"Representatives"</Text> means any directors,
        officers, employees, legal, financial and other expert advisers and
        agents of the Recipient.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>"Permitted Purpose"</Text> means the purpose
        of assessing whether or not the Recipient will pursue a Permitted
        Transaction.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>"Permitted Transaction"</Text> means any
        transaction agreed between the Disclosing Party and the Recipient and/or
        their respective Bodies Corporate pursuant to which the Recipient or any
        of its Related Bodies Corporate lends monies to or participates in any
        commercial transaction with the Disclosing Party or any of its Related
        Bodies Corporate.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>1.2 Interpretation</Text>
      </Text>
      <View style={styles.list}>
        <Text style={styles.listItem}>
          • Headings are for convenience only and do not affect interpretation;
        </Text>
        <Text style={styles.listItem}>
          • The singular includes the plural and vice versa;
        </Text>
        <Text style={styles.listItem}>
          • If a word or phrase is defined, its other grammatical forms have a
          corresponding meaning;
        </Text>
        <Text style={styles.listItem}>
          • A reference to a party to this Deed includes the party's successors
          and assigns;
        </Text>
        <Text style={styles.listItem}>
          • A reference to legislation or to a provision of legislation includes
          a modification or re-enactment of it, a legislative provision
          substituted for it and a regulation or statutory instrument issued
          under it.
        </Text>
      </View>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>1.3 Consents and approvals</Text>
      </Text>
      <Text style={styles.paragraph}>
        Except as expressly provided in this Deed, if the doing of any act,
        matter or thing under this Deed is dependent on the consent or approval
        of a party or is within the discretion of a party, such consent or
        approval may be given or such discretion may be exercised conditionally
        or unconditionally or withheld by the party in its absolute discretion.
      </Text>

      <Text style={styles.h3}>2. PROVISION OF CONFIDENTIAL INFORMATION</Text>
      <Text style={styles.paragraph}>
        Subject to this Deed, the Disclosing Party may, but shall not be obliged
        to, provide any Confidential Information to the Recipient.
      </Text>

      <Text style={styles.h3}>3. CONFIDENTIALITY</Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>
          3.1 The Recipient undertakes and covenants (on its own behalf and on
          behalf of all its Representatives):
        </Text>
      </Text>
      <View style={styles.list}>
        <Text style={styles.listItem}>
          • To keep and hold all Confidential Information strictly confidential
          and, subject to Clause 4, not to disclose or permit the disclosure,
          publication or communication of any of the Confidential Information to
          any person except in accordance with the terms of this Deed or unless
          it obtains the Disclosing Party's prior written consent;
        </Text>
        <Text style={styles.listItem}>
          • To take all reasonable steps and do all things that are necessary,
          prudent or desirable to maintain and preserve the confidentiality of
          the Confidential Information;
        </Text>
        <Text style={styles.listItem}>
          • Not to reproduce or record in any form or use any of the
          Confidential Information except for the Permitted Purpose;
        </Text>
        <Text style={styles.listItem}>
          • Not to permit or cause any of the Confidential Information to be
          entered into any computer or database which is not solely operated and
          controlled by the Recipient, without the prior written consent of the
          Disclosing Party;
        </Text>
        <Text style={styles.listItem}>
          • Not to use or appropriate any of the Confidential Information for
          its own benefit or gain or for any purpose except for the Permitted
          Purpose, and not to make any use of the Confidential Information or
          any part of it to the competitive disadvantage of the Disclosing Party
          or any of its Related Bodies Corporate;
        </Text>
        <Text style={styles.listItem}>
          • To ensure that its Representatives are aware that they are obliged
          to treat any Confidential Information received by them in the same
          manner as if they were a party to this Deed;
        </Text>
        <Text style={styles.listItem}>
          • To ensure that its Representatives and Related Bodies Corporate
          comply with the Recipient's obligations under this Deed as if each
          Representative and Related Body Corporate were a party to this Deed;
        </Text>
        <Text style={styles.listItem}>
          • To notify the Disclosing Party immediately it suspects or becomes
          aware of any breach of this Deed;
        </Text>
        <Text style={styles.listItem}>
          • To promptly take all reasonable steps, at its own expense, to
          prevent or stop any actual or suspected breach of this Deed.
        </Text>
      </View>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>3.2 Prohibition on discussions</Text>
      </Text>
      <View style={styles.list}>
        <Text style={styles.listItem}>
          • Not, without the prior consent of the Disclosing Party, directly or
          indirectly make any enquiries of or discuss with any financier,
          customer, supplier, landlord, tenant or creditor of the Disclosing
          Party or any of its Related Bodies Corporate, any matters concerning
          the Confidential Information;
        </Text>
        <Text style={styles.listItem}>
          • Not make any enquiries of or discuss with any officer, employee or
          agent of the Disclosing Party or any of its Related Bodies Corporate,
          any matters concerning the Confidential Information;
        </Text>
        <Text style={styles.listItem}>
          • Not disclose, publish or permit the disclosure or publication of the
          Permitted Purpose or the fact that any discussions are taking place or
          have taken place in relation to the Permitted Purpose to any person
          (other than in accordance with this Deed).
        </Text>
      </View>
    </Page>

    {/* Page 2 - Sections 4-9 */}
    <Page size="A4" style={styles.page}>
      <Image src={logoBase64} style={styles.watermark} fixed />
      <View style={styles.footer} fixed>
        <View style={styles.footerLine} />
      </View>

      <Text style={styles.h3}>4. PERMITTED DISCLOSURE</Text>
      <Text style={styles.paragraph}>
        The Recipient may disclose Confidential Information to such of its
        Representatives or Related Bodies Corporate who reasonably require
        access to the Confidential Information in order for the Recipient to
        undertake the Permitted Purpose.
      </Text>

      <Text style={styles.h3}>5. MANDATORY DISCLOSURE</Text>
      <Text style={styles.paragraph}>
        Nothing in this Deed prohibits the Recipient from disclosing any
        Confidential Information which is required to be disclosed by law, an
        order of a court, tribunal, government or regulatory body or competent
        jurisdiction or the Listing Rules of the Australian Stock Exchange
        Limited, provided that where disclosure is so required, the Recipient
        must notify the Disclosing Party as soon as reasonably practicable and
        must provide all reasonable assistance and co-operation to enable the
        Disclosing Party to seek a protective order or other relief from or to
        minimise the disclosure.
      </Text>

      <Text style={styles.h3}>6. DISCLAIMER</Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>6.1 Disclosing Party not liable</Text>
      </Text>
      <Text style={styles.paragraph}>
        The Recipient acknowledges that it is making an independent assessment
        of the Confidential Information and will verify all information on which
        it intends to rely to its own satisfaction and that, subject to the
        Confidential Information being provided in good faith, the Disclosing
        Party does not and will not give any warranty as to the truth, accuracy,
        relevance or usefulness of any of the Confidential Information and does
        not accept any responsibility for any falsity, inaccuracy or misleading
        information in, or for any omission from, the Confidential Information,
        except to the extent expressly provided for in any agreement binding
        upon the Disclosing Party.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>6.2 Recipient's conclusions its own</Text>
      </Text>
      <Text style={styles.paragraph}>
        The Disclosing Party accepts no responsibility for any interpretation,
        opinion or conclusion that the Recipient may form as a result of
        examining the Confidential Information.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>6.3 Opinions expressed may change</Text>
      </Text>
      <Text style={styles.paragraph}>
        The Recipient acknowledges that any opinions expressed in the
        Confidential Information are based on the knowledge and approach of the
        persons forming the opinion at the date that the opinion was formed and
        may have ceased or may in the future cease to be appropriate in the
        light of subsequent knowledge or attitudes.
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>6.4 The Disclosing Party's rights</Text>
      </Text>
      <Text style={styles.paragraph}>
        The Disclosing Party reserves all rights in the Confidential Information
        and no rights or obligations other than those expressly contained in
        this Deed are granted or to be implied from this Deed. In particular, no
        licence is granted directly or indirectly under any patent, invention,
        discovery, copyright or other intellectual property right now or in the
        future held, made, obtained or licensable by the Disclosing Party. The
        Recipient acknowledges that the Confidential Information and all
        intellectual property rights in the Confidential Information (including
        copyright, design and patent rights) will, to the extent owned prior to
        disclosure, remain the exclusive property of the Disclosing Party.
      </Text>

      <Text style={styles.h3}>7. RETURN OF CONFIDENTIAL INFORMATION</Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>7.1</Text> Upon the earlier of completion or
        discontinuance of the Permitted Purpose or request by the Disclosing
        Party, the Recipient must promptly return to the Disclosing Party (or
        destroy if the Disclosing Party so directs) all documents and other
        materials (whether originals, copies or in electronic form) within the
        custody, power or control of the Recipient which contain any
        Confidential Information.
      </Text>
      <Text style={styles.paragraph}>
        Notwithstanding the foregoing, the Recipient may, in its discretion:
      </Text>
      <View style={styles.list}>
        <Text style={styles.listItem}>
          • Deliver or destroy Derived Information;
        </Text>
        <Text style={styles.listItem}>
          • Retain minutes of meeting of its directors, together with such
          supporting documentation as is customarily retained by the Recipient
          in relation to such minutes, relating to any determination by the
          directors to pursue a Permitted Transaction.
        </Text>
      </View>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>7.2</Text> Return, destruction or retention of
        Confidential Information in accordance with this Clause 7 does not
        release the Recipient from its obligations under this Deed.
      </Text>

      <Text style={styles.h3}>8. THIRD PARTIES</Text>
      <Text style={styles.paragraph}>
        The Recipient acknowledges that the Disclosing Party is free to disclose
        any Confidential Information to any other person and is not obliged to
        notify the Recipient if it does so.
      </Text>

      <Text style={styles.h3}>9. CONTINUING OBLIGATION</Text>
      <Text style={styles.paragraph}>
        The Recipient acknowledges and agrees that the terms, conditions and
        obligations under this Deed do not cease on the termination or cessation
        of this Deed or on the completion, postponement or discontinuance of the
        Permitted Purpose, but will continue indefinitely.
      </Text>
    </Page>

    {/* Page 3 - Sections 10-18 */}
    <Page size="A4" style={styles.page}>
      <Image src={logoBase64} style={styles.watermark} fixed />
      <View style={styles.footer} fixed>
        <View style={styles.footerLine} />
      </View>

      <Text style={styles.h3}>10. BENEFIT OF AGREEMENT</Text>
      <Text style={styles.paragraph}>
        The Disclosing Party enters into this Deed for and on behalf of itself
        and the other Beneficiaries. The Recipient acknowledges that the
        Disclosing Party may enforce this Deed on behalf of itself and the other
        Beneficiaries.
      </Text>

      <Text style={styles.h3}>11. INDEMNITY</Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>11.1</Text> The Recipient indemnifies and must
        keep indemnified each of the Beneficiaries from and against all claims,
        costs, expenses, losses and liabilities (including legal costs on a
        solicitor and own client basis) suffered or incurred by any of them
        (including, without limitation, in connection with the enforcement of
        this Deed) as a result of or in connection with:
      </Text>
      <View style={styles.list}>
        <Text style={styles.listItem}>
          • Any breach of this Deed by the Recipient;
        </Text>
        <Text style={styles.listItem}>
          • Any act or omission by any of its Representatives which, if done or
          omitted to be done by the Recipient would constitute a breach of the
          Recipient's obligations under this Deed.
        </Text>
      </View>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>11.2</Text> The indemnity given by the
        Recipient in this Clause 11:
      </Text>
      <View style={styles.list}>
        <Text style={styles.listItem}>
          • Is for the benefit of each of the Beneficiaries. The indemnity may
          be enforced by the Disclosing Party on behalf of itself and the other
          Beneficiaries or by any Beneficiary on its own behalf;
        </Text>
        <Text style={styles.listItem}>
          • Shall survive the termination of this Deed.
        </Text>
      </View>

      <Text style={styles.h3}>12. REMEDIES</Text>
      <Text style={styles.paragraph}>
        The Recipient acknowledges that damages is an inadequate remedy for any
        breach of this Deed and that subject to the court's discretion (and in
        addition to any other remedies available at law or in equity), the
        Disclosing Party is entitled to specific performance or injunctive
        relief (as appropriate) in respect of any conduct or proposed conduct by
        the Recipient or any Representative which is or will constitute a breach
        of this Deed.
      </Text>

      <Text style={styles.h3}>13. NOTICES</Text>
      <Text style={styles.paragraph}>Any notice given under this Deed:</Text>
      <View style={styles.list}>
        <Text style={styles.listItem}>
          • Must be in writing addressed to the intended recipient at the
          address shown below or the address last notified by the intended
          recipient to the sender:
        </Text>
      </View>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Disclosing Party</Text>
        {"\n"}
        Load Link Australia Pty Limited & AJK ENGINES PTY LIMITED{"\n"}
        Unit 44/211 Brisbane Road Biggera Waters, Queensland 4216{"\n"}
        Attention: Mr Anthony Kosseris{"\n"}
        Email: anthony@loadlink.com.au
      </Text>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Recipient</Text>
        {"\n"}
        {companyName}
        {"\n"}
        {street}, {state} {postcode}
        {"\n"}
        Attention: {repName}
        {"\n"}
        Email: {email}
      </Text>

      <View style={styles.list}>
        <Text style={styles.listItem}>
          • Must be signed by a person duly authorised by the sender;
        </Text>
        <Text style={styles.listItem}>
          • Will be taken to have been given when delivered, received or left at
          the above address. If delivery or receipt occurs on a day when
          business is not generally carried on in the place to which the notice
          is sent, or is later than 4.00 pm (local time), it will be taken to
          have been duly given at the commencement of business on the next day
          when business is generally carried on in that place.
        </Text>
      </View>

      <Text style={styles.h3}>14. AMENDMENT</Text>
      <Text style={styles.paragraph}>
        This Deed may be amended only by another deed executed by all parties.
      </Text>

      <Text style={styles.h3}>15. NO WAIVER</Text>
      <Text style={styles.paragraph}>
        No failure to exercise and no delay in exercising any right, power or
        remedy under this Deed will operate as a waiver. Nor will any single or
        partial exercise of any right, power or remedy preclude any other or
        further exercise of that or any other right, power or remedy.
      </Text>

      <Text style={styles.h3}>16. STAMP DUTY AND COSTS</Text>
      <Text style={styles.paragraph}>
        Each party shall bear its own costs arising out of the preparation of
        this Deed. All stamp duty chargeable on this Deed shall be borne by the
        Recipient. The Recipient shall indemnify the Disclosing Party on demand
        against any liability for that stamp duty.
      </Text>

      <Text style={styles.h3}>17. GOVERNING LAW</Text>
      <Text style={styles.paragraph}>
        This Deed is governed by the laws in force in Queensland. Each party
        irrevocably and unconditionally submits to the non-exclusive
        jurisdiction of the courts exercising jurisdiction there.
      </Text>

      <Text style={styles.h3}>18. COUNTERPARTS</Text>
      <Text style={styles.paragraph}>
        This Deed may be executed in any number of counterparts. All
        counterparts taken together will be taken to constitute one instrument.
      </Text>
    </Page>

    {/* Signature Page */}
    <Page size="A4" style={styles.page}>
      <View style={styles.footer} fixed>
        <View style={styles.footerLine} />
      </View>

      <Text style={styles.h3}>EXECUTED AS A DEED</Text>

      <Text style={styles.paragraph}>SIGNED SEALED AND DELIVERED</Text>
      <Text style={styles.paragraph}>by LOAD LINK AUSTRALIA PTY LIMITED</Text>
      <Text style={styles.paragraph}>and AJK ENGINES PTY LIMITED</Text>
      <Text style={styles.paragraph}>
        in accordance with section 127 of the Corporations Act and in the
        presence of:
      </Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
        {/* Left side - Load Link signature */}
        <View style={{ width: '45%' }}>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Signed:</Text>
          </Text>

          <View style={styles.signatureBox}>
            <Image src={sig1Base64} style={styles.signatureImage} />
            <Text style={{ marginTop: 10, fontSize: 10 }}>
              Anthony Kousesis{"\n"}Managing Director{"\n"}
              {deedDate}
            </Text>
          </View>

          <Text style={styles.paragraph}>SIGNED SEALED AND DELIVERED</Text>
          <Text style={styles.paragraph}>by AJK Engines PTY LTD</Text>
        </View>

        {/* Right side - Recipient signature */}
        <View style={{ width: '45%' }}>
          <Text style={styles.paragraph}>
            <Text style={styles.bold}>Signed by {repName}</Text>
            {"\n"}
            as authorised representative of{" "}
            <Text style={styles.bold}>{companyName}</Text>
          </Text>

          <View style={styles.signatureBox}>
            <Image src={signatureBase64} style={styles.signatureImage} />
            <Text style={{ marginTop: 10, fontSize: 10 }}>
              <Text style={styles.bold}>Date:</Text> {deedDate}
            </Text>
          </View>
        </View>
      </View>

      <View
        style={{
          marginTop: 40,
          fontSize: 9,
          fontStyle: "italic",
          color: "#6b7280",
          textAlign: "center",
        }}
      >
        <Text>
          This Confidentiality Deed was generated electronically and is a
          legally binding document.
        </Text>
        <Text>
          Document generated on {deedDate} for {companyName}
        </Text>
      </View>
    </Page>
  </Document>
);

export default ConfidentialityDeedPDF;
