import React from 'react';
import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    paddingBottom: 200,
    fontFamily: 'Times-Roman',
    fontSize: 11,
    lineHeight: 1.8,
    color: '#1f2937',
  },
  titlePage: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
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
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 24,
  },
  titleDivider: {
    width: 400,
    height: 1,
    backgroundColor: '#9ca3af',
    marginVertical: 24,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 2,
    marginVertical: 24,
  },
  h1: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    color: '#bb964c',
    letterSpacing: 0.5,
  },
  h2: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
    color: '#bb964c',
  },
  h3: {
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 10,
    color: '#bb964c',
  },
  paragraph: {
    marginBottom: 12,
    textAlign: 'justify',
  },
  bold: {
    fontWeight: 'bold',
  },
  list: {
    marginLeft: 40,
    marginBottom: 12,
  },
  listItem: {
    marginBottom: 10,
    textAlign: 'justify',
    flexDirection: 'row',
  },
  signatureSection: {
    marginTop: 40,
  },
  signatureBox: {
    border: '2px solid #d1d5db',
    padding: 10,
    marginVertical: 15,
    textAlign: 'center',
    width: 150,
    fontSize: 9,
  },
  signatureImage: {
    width: 130,
    height: 130,
    marginHorizontal: 'auto',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    paddingHorizontal: 40,
    paddingBottom: 10,
  },
  footerLine: {
    width: '100%',
    height: 3,
    backgroundColor: '#bb964c',
  },
  watermark: {
    position: 'absolute',
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
      <Text style={styles.titleText}>and</Text>
      <Text style={[styles.partyName, { textTransform: 'uppercase' }]}>{companyName}</Text>
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
        <Text style={styles.bold}>BETWEEN:</Text> LOAD LINK AUSTRALIA PTY LIMITED (ACN 661 824 175) of Unit 44/211 Brisbane Road Biggera Waters, Queensland 4216 ("Disclosing Party"); and <Text style={styles.bold}>{companyName}</Text> (ACN {acn}) of {street}, {state} {postcode} ("Recipient").
      </Text>

      <Text style={styles.h2}>WHEREAS:</Text>
      <Text style={styles.paragraph}>
        A. The Disclosing Party and the Recipient wish to pursue discussions concerning possible transactions between them and to that end it is necessary for the Disclosing Party to provide certain Confidential Information to the Recipient.
      </Text>
      <Text style={styles.paragraph}>
        B. The Confidential Information is of significant commercial value to the Disclosing Party.
      </Text>
      <Text style={styles.paragraph}>
        C. The Disclosing Party proposes to make the Confidential Information available to the Recipient for the Permitted Purpose subject to and in consideration of the Recipient entering into this Deed.
      </Text>

      <Text style={styles.h2}>NOW THIS DEED WITNESSES as follows:</Text>

      <Text style={styles.h3}>1. DEFINITIONS AND INTERPRETATIONS</Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>1.1 Definitions</Text>
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>"Beneficiaries"</Text> means the Disclosing Party and each of its Related Bodies Corporate who have an interest in, or who are the subject of, any of the Confidential Information.
      </Text>
      <Text style={styles.paragraph}>
        <Text style={styles.bold}>"Confidential Information"</Text> means:
      </Text>

      {/* Note: @react-pdf/renderer doesn't support complex nested lists well, 
          so we'll use simple text with prefixes */}
      <View style={styles.list}>
        <Text style={styles.listItem}>
          a) All commercial, financial, legal and technical information and know-how directly or indirectly related to the business or affairs of the Disclosing Party...
        </Text>
        <Text style={styles.listItem}>
          b) The contents of any discussions or agreements between the parties and/or their Related Bodies Corporate relating to a Permitted Transaction;
        </Text>
        <Text style={styles.listItem}>
          c) Derived Information;
        </Text>
        <Text style={styles.listItem}>
          d) The terms and conditions and existence of this Deed;
        </Text>
      </View>

      <Text style={styles.paragraph}>But does not include information:</Text>
      
      <View style={styles.list}>
        <Text style={styles.listItem}>
          a) Which at the time of first disclosure to the Recipient is in the public domain;
        </Text>
        <Text style={styles.listItem}>
          b) Which after disclosure to the Recipient comes into the public domain otherwise than by disclosure in breach of the terms of this Deed;
        </Text>
      </View>

      {/* Add more sections as needed - this is a simplified version */}
      
    </Page>

    {/* Signature Page */}
    <Page size="A4" style={styles.page}>
      <View style={styles.footer} fixed>
        <View style={styles.footerLine} />
      </View>

      <Text style={styles.h3}>EXECUTED AS A DEED</Text>
      
      <Text style={styles.paragraph}>SIGNED SEALED AND DELIVERED</Text>
      <Text style={styles.paragraph}>by LOAD LINK AUSTRALIA PTY LIMITED</Text>
      <Text style={styles.paragraph}>in accordance with section 127 of the Corporations Act and in the presence of:</Text>
      
      <Text style={styles.paragraph}><Text style={styles.bold}>Signed:</Text></Text>
      
      <View style={styles.signatureBox}>
        <Image src={sig1Base64} style={styles.signatureImage} />
        <Text style={{ marginTop: 10, fontSize: 10 }}>Anthony Kousesis{'\n'}Managing Director{'\n'}{deedDate}</Text>
      </View>

      <Text style={styles.paragraph}>SIGNED SEALED AND DELIVERED</Text>
      <Text style={styles.paragraph}>by AJK Engines PTY LTD</Text>
      
      <View style={styles.signatureBox}>
        <Image src={sig2Base64} style={styles.signatureImage} />
        <Text style={{ marginTop: 10, fontSize: 10 }}>Matthew Hunt{'\n'}AJK Engines PTY LTD{'\n'}{deedDate}</Text>
      </View>

      <Text style={styles.paragraph}>
        <Text style={styles.bold}>Signed by {repName}</Text>{'\n'}
        as authorised representative of <Text style={styles.bold}>{companyName}</Text>
      </Text>

      <View style={styles.signatureBox}>
        <Image src={signatureBase64} style={styles.signatureImage} />
        <Text style={{ marginTop: 10, fontSize: 10 }}><Text style={styles.bold}>Date:</Text> {deedDate}</Text>
      </View>

      <View style={{ marginTop: 40, fontSize: 9, fontStyle: 'italic', color: '#6b7280', textAlign: 'center' }}>
        <Text>This Confidentiality Deed was generated electronically and is a legally binding document.</Text>
        <Text>Document generated on {deedDate} for {companyName}</Text>
      </View>
    </Page>
  </Document>
);

export default ConfidentialityDeedPDF;
