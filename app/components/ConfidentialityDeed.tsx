interface ConfidentialityDeedProps {
  companyName: string;
  acn: string;
  street: string;
  state: string;
  postcode: string;
  repName: string;
  email: string;
  today: string;
}

export default function ConfidentialityDeed({
  companyName,
  acn,
  street,
  state,
  postcode,
  repName,
  email,
  today,
}: ConfidentialityDeedProps) {
  return (
    <div className="max-h-[600px] overflow-y-auto border border-gray-300 rounded-lg p-6 bg-gray-50 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
      <h3 className="font-bold text-lg mb-4">CONFIDENTIALITY DEED</h3>
      <p className="mb-4">THIS DEED is made the day of {today}</p>
      <p className="mb-4">
        BETWEEN: LOAD LINK AUSTRALIA PTY LIMITED (ACN 661 824 175) of
        Unit 44/211 Brisbane Road Biggera Waters, Queensland 4216
        (&quot;Disclosing Party&quot;); and{" "}
        {companyName || "[Your Company]"} (ACN{" "}
        {acn || "___"}) of {street || "___"},{" "}
        {state || "___"} {postcode || "___"}{" "}
        (&quot;Recipient&quot;).
      </p>

      <h4 className="font-bold mt-6 mb-2">WHEREAS:</h4>
      <p className="mb-2">
        A. The Disclosing Party and the Recipient wish to pursue
        discussions concerning possible transactions between them and
        to that end it is necessary for the Disclosing Party to
        provide certain Confidential Information to the Recipient.
      </p>
      <p className="mb-2">
        B. The Confidential Information is of significant commercial
        value to the Disclosing Party.
      </p>
      <p className="mb-4">
        C. The Disclosing Party proposes to make the Confidential
        Information available to the Recipient for the Permitted
        Purpose subject to and in consideration of the Recipient
        entering into this Deed.
      </p>

      <h4 className="font-bold mt-6 mb-2">
        NOW THIS DEED WITNESSES as follows:
      </h4>
      <h5 className="font-semibold mt-4 mb-2">
        1. DEFINITIONS AND INTERPRETATIONS
      </h5>
      <p className="mb-2">
        <strong>1.1 Definitions</strong>
      </p>
      <p className="mb-2">
        &quot;Beneficiaries&quot; means the Disclosing Party and each of its
        Related Bodies Corporate who have an interest in, or who are
        the subject of, any of the Confidential Information.
      </p>
      <p className="mb-2">&quot;Confidential Information&quot; means:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>
          All commercial, financial, legal and technical information
          and know-how directly or indirectly related to the business
          or affairs of the Disclosing Party or its Related Bodies
          Corporate which is disclosed (whether orally,
          electronically, in writing or any other form or media
          whatsoever) by or on behalf of the Disclosing Party to the
          Recipient or any of its Representatives and includes,
          without limitation, all documents at any time contained in
          any Data Room;
        </li>
        <li>
          The contents of any discussions or agreements between the
          parties and/or their Related Bodies Corporate relating to a
          Permitted Transaction;
        </li>
        <li>Derived Information;</li>
        <li>The terms and conditions and existence of this Deed;</li>
        <li>
          The fact that discussions have already occurred between the
          parties in relation to a possible Permitted Transaction and
          that further such discussions may occur in the future;
        </li>
        <li>
          The fact that the Disclosing Party has disclosed or may
          disclose information to the Recipient pursuant to this Deed;
        </li>
      </ul>
      <p className="mb-2">But does not include information:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>
          Which at the time of first disclosure to the Recipient is in
          the public domain;
        </li>
        <li>
          Which after disclosure to the Recipient comes into the
          public domain otherwise than by disclosure in breach of the
          terms of this Deed;
        </li>
        <li>
          Which was known to or by the Recipient at the time of first
          disclosure to it and was not acquired directly or indirectly
          from the Disclosing Party;
        </li>
        <li>
          Which the Recipient receives from a third party, provided
          that as far as the Recipient is aware (without the need for
          enquiry) the information was not obtained directly or
          indirectly from the Disclosing Party in breach of an
          obligation of confidence owed by the third party to the
          Disclosing Party or any other person.
        </li>
      </ul>
      <p className="mb-2">
        &quot;Derived Information&quot; means any note, calculation, conclusion,
        summary or other material derived or produced partly or wholly
        from any Confidential Information.
      </p>
      <p className="mb-2">
        &quot;document&quot; has the meaning given to it in Section 9 of the
        Corporations Law.
      </p>
      <p className="mb-2">
        &quot;Related Bodies Corporate&quot; has the meaning given to it in
        Section 50 of the Corporations Law.
      </p>
      <p className="mb-2">
        &quot;Representatives&quot; means any directors, officers, employees,
        legal, financial and other expert advisers and agents of the
        Recipient.
      </p>
      <p className="mb-2">
        &quot;Permitted Purpose&quot; means the purpose of assessing whether or
        not the Recipient will pursue a Permitted Transaction.
      </p>
      <p className="mb-2">
        &quot;Permitted Transaction&quot; means any transaction agreed between
        the Disclosing Party and the Recipient and/or their respective
        Bodies Corporate pursuant to which the Recipient or any of its
        Related Bodies Corporate lends monies to or participates in
        any commercial transaction with the Disclosing Party or any of
        its Related Bodies Corporate.
      </p>
      <p className="mb-2">
        <strong>1.2 Interpretation</strong>
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>
          Headings are for convenience only and do not affect
          interpretation;
        </li>
        <li>The singular includes the plural and vice versa;</li>
        <li>
          If a word or phrase is defined, its other grammatical forms
          have a corresponding meaning;
        </li>
        <li>
          A reference to a party to this Deed includes the party&apos;s
          successors and assigns;
        </li>
        <li>
          A reference to legislation or to a provision of legislation
          includes a modification or re-enactment of it, a legislative
          provision substituted for it and a regulation or statutory
          instrument issued under it.
        </li>
      </ul>

      <p className="mb-2">
        <strong>1.3 Consents and approvals</strong>
      </p>
      <p className="mb-4">
        Except as expressly provided in this Deed, if the doing of any
        act, matter or thing under this Deed is dependent on the
        consent or approval of a party or is within the discretion of
        a party, such consent or approval may be given or such
        discretion may be exercised conditionally or unconditionally
        or withheld by the party in its absolute discretion.
      </p>

      <h5 className="font-semibold mt-4 mb-2">
        2. PROVISION OF CONFIDENTIAL INFORMATION
      </h5>
      <p className="mb-4">
        Subject to this Deed, the Disclosing Party may, but shall not
        be obliged to, provide any Confidential Information to the
        Recipient.
      </p>

      <h5 className="font-semibold mt-4 mb-2">3. CONFIDENTIALITY</h5>
      <p className="mb-2">
        <strong>
          3.1 The Recipient undertakes and covenants (on its own
          behalf and on behalf of all its Representatives):
        </strong>
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>
          To keep and hold all Confidential Information strictly
          confidential and, subject to Clause 4, not to disclose or
          permit the disclosure, publication or communication of any
          of the Confidential Information to any person except in
          accordance with the terms of this Deed or unless it obtains
          the Disclosing Party&apos;s prior written consent;
        </li>
        <li>
          To take all reasonable steps and do all things that are
          necessary, prudent or desirable to maintain and preserve the
          confidentiality of the Confidential Information;
        </li>
        <li>
          Not to reproduce or record in any form or use any of the
          Confidential Information except for the Permitted Purpose;
        </li>
        <li>
          Not to permit or cause any of the Confidential Information
          to be entered into any computer or database which is not
          solely operated and controlled by the Recipient, without the
          prior written consent of the Disclosing Party;
        </li>
        <li>
          Not to use or appropriate any of the Confidential
          Information for its own benefit or gain or for any purpose
          except for the Permitted Purpose, and not to make any use of
          the Confidential Information or any part of it to the
          competitive disadvantage of the Disclosing Party or any of
          its Related Bodies Corporate;
        </li>
        <li>
          To ensure that its Representatives are aware that they are
          obliged to treat any Confidential Information received by
          them in the same manner as if they were a party to this
          Deed;
        </li>
        <li>
          To ensure that its Representatives and Related Bodies
          Corporate comply with the Recipient&apos;s obligations under this
          Deed as if each Representative and Related Body Corporate
          were a party to this Deed;
        </li>
        <li>
          To notify the Disclosing Party immediately it suspects or
          becomes aware of any breach of this Deed;
        </li>
        <li>
          To promptly take all reasonable steps, at its own expense,
          to prevent or stop any actual or suspected breach of this
          Deed.
        </li>
      </ul>

      <p className="mb-2">
        <strong>3.2 Prohibition on discussions</strong>
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>
          Not, without the prior consent of the Disclosing Party,
          directly or indirectly make any enquiries of or discuss with
          any financier, customer, supplier, landlord, tenant or
          creditor of the Disclosing Party or any of its Related
          Bodies Corporate, any matters concerning the Confidential
          Information;
        </li>
        <li>
          Not make any enquiries of or discuss with any officer,
          employee or agent of the Disclosing Party or any of its
          Related Bodies Corporate, any matters concerning the
          Confidential Information;
        </li>
        <li>
          Not disclose, publish or permit the disclosure or
          publication of the Permitted Purpose or the fact that any
          discussions are taking place or have taken place in relation
          to the Permitted Purpose to any person (other than in
          accordance with this Deed).
        </li>
      </ul>
      <h5 className="font-semibold mt-4 mb-2">
        4. PERMITTED DISCLOSURE
      </h5>
      <p className="mb-4">
        The Recipient may disclose Confidential Information to such of
        its Representatives or Related Bodies Corporate who reasonably
        require access to the Confidential Information in order for
        the Recipient to undertake the Permitted Purpose.
      </p>

      <h5 className="font-semibold mt-4 mb-2">
        5. MANDATORY DISCLOSURE
      </h5>
      <p className="mb-4">
        Nothing in this Deed prohibits the Recipient from disclosing
        any Confidential Information which is required to be disclosed
        by law, an order of a court, tribunal, government or
        regulatory body or competent jurisdiction or the Listing Rules
        of the Australian Stock Exchange Limited, provided that where
        disclosure is so required, the Recipient must notify the
        Disclosing Party as soon as reasonably practicable and must
        provide all reasonable assistance and co-operation to enable
        the Disclosing Party to seek a protective order or other
        relief from or to minimise the disclosure.
      </p>

      <h5 className="font-semibold mt-4 mb-2">6. DISCLAIMER</h5>
      <p className="mb-2">
        <strong>6.1 Disclosing Party not liable</strong>
      </p>
      <p className="mb-2">
        The Recipient acknowledges that it is making an independent
        assessment of the Confidential Information and will verify all
        information on which it intends to rely to its own
        satisfaction and that, subject to the Confidential Information
        being provided in good faith, the Disclosing Party does not
        and will not give any warranty as to the truth, accuracy,
        relevance or usefulness of any of the Confidential Information
        and does not accept any responsibility for any falsity,
        inaccuracy or misleading information in, or for any omission
        from, the Confidential Information, except to the extent
        expressly provided for in any agreement binding upon the
        Disclosing Party.
      </p>
      <p className="mb-2">
        <strong>6.2 Recipient&apos;s conclusions its own</strong>
      </p>
      <p className="mb-2">
        The Disclosing Party accepts no responsibility for any
        interpretation, opinion or conclusion that the Recipient may
        form as a result of examining the Confidential Information.
      </p>
      <p className="mb-2">
        <strong>6.3 Opinions expressed may change</strong>
      </p>
      <p className="mb-2">
        The Recipient acknowledges that any opinions expressed in the
        Confidential Information are based on the knowledge and
        approach of the persons forming the opinion at the date that
        the opinion was formed and may have ceased or may in the
        future cease to be appropriate in the light of subsequent
        knowledge or attitudes.
      </p>
      <p className="mb-2">
        <strong>6.4 The Disclosing Party&apos;s rights</strong>
      </p>
      <p className="mb-4">
        The Disclosing Party reserves all rights in the Confidential
        Information and no rights or obligations other than those
        expressly contained in this Deed are granted or to be implied
        from this Deed. In particular, no licence is granted directly
        or indirectly under any patent, invention, discovery,
        copyright or other intellectual property right now or in the
        future held, made, obtained or licensable by the Disclosing
        Party. The Recipient acknowledges that the Confidential
        Information and all intellectual property rights in the
        Confidential Information (including copyright, design and
        patent rights) will, to the extent owned prior to disclosure,
        remain the exclusive property of the Disclosing Party.
      </p>

      <h5 className="font-semibold mt-4 mb-2">
        7. RETURN OF CONFIDENTIAL INFORMATION
      </h5>
      <p className="mb-2">
        <strong>7.1</strong> Upon the earlier of completion or
        discontinuance of the Permitted Purpose or request by the
        Disclosing Party, the Recipient must promptly return to the
        Disclosing Party (or destroy if the Disclosing Party so
        directs) all documents and other materials (whether originals,
        copies or in electronic form) within the custody, power or
        control of the Recipient which contain any Confidential
        Information.
      </p>
      <p className="mb-2">
        Notwithstanding the foregoing, the Recipient may, in its
        discretion:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>Deliver or destroy Derived Information;</li>
        <li>
          Retain minutes of meeting of its directors, together with
          such supporting documentation as is customarily retained by
          the Recipient in relation to such minutes, relating to any
          determination by the directors to pursue a Permitted
          Transaction.
        </li>
      </ul>
      <p className="mb-4">
        <strong>7.2</strong> Return, destruction or retention of
        Confidential Information in accordance with this Clause 7 does
        not release the Recipient from its obligations under this
        Deed.
      </p>

      <h5 className="font-semibold mt-4 mb-2">8. THIRD PARTIES</h5>
      <p className="mb-4">
        The Recipient acknowledges that the Disclosing Party is free
        to disclose any Confidential Information to any other person
        and is not obliged to notify the Recipient if it does so.
      </p>

      <h5 className="font-semibold mt-4 mb-2">
        9. CONTINUING OBLIGATION
      </h5>
      <p className="mb-4">
        The Recipient acknowledges and agrees that the terms,
        conditions and obligations under this Deed do not cease on the
        termination or cessation of this Deed or on the completion,
        postponement or discontinuance of the Permitted Purpose, but
        will continue indefinitely.
      </p>

      <h5 className="font-semibold mt-4 mb-2">
        10. BENEFIT OF AGREEMENT
      </h5>
      <p className="mb-4">
        The Disclosing Party enters into this Deed for and on behalf
        of itself and the other Beneficiaries. The Recipient
        acknowledges that the Disclosing Party may enforce this Deed
        on behalf of itself and the other Beneficiaries.
      </p>

      <h5 className="font-semibold mt-4 mb-2">11. INDEMNITY</h5>
      <p className="mb-2">
        <strong>11.1</strong> The Recipient indemnifies and must keep
        indemnified each of the Beneficiaries from and against all
        claims, costs, expenses, losses and liabilities (including
        legal costs on a solicitor and own client basis) suffered or
        incurred by any of them (including, without limitation, in
        connection with the enforcement of this Deed) as a result of
        or in connection with:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>Any breach of this Deed by the Recipient;</li>
        <li>
          Any act or omission by any of its Representatives which, if
          done or omitted to be done by the Recipient would constitute
          a breach of the Recipient&apos;s obligations under this Deed.
        </li>
      </ul>
      <p className="mb-2">
        <strong>11.2</strong> The indemnity given by the Recipient in
        this Clause 11:
      </p>
      <ul className="list-disc ml-6 mb-4">
        <li>
          Is for the benefit of each of the Beneficiaries. The
          indemnity may be enforced by the Disclosing Party on behalf
          of itself and the other Beneficiaries or by any Beneficiary
          on its own behalf;
        </li>
        <li>Shall survive the termination of this Deed.</li>
      </ul>

      <h5 className="font-semibold mt-4 mb-2">12. REMEDIES</h5>
      <p className="mb-4">
        The Recipient acknowledges that damages is an inadequate
        remedy for any breach of this Deed and that subject to the
        court&apos;s discretion (and in addition to any other remedies
        available at law or in equity), the Disclosing Party is
        entitled to specific performance or injunctive relief (as
        appropriate) in respect of any conduct or proposed conduct by
        the Recipient or any Representative which is or will
        constitute a breach of this Deed.
      </p>

      <h5 className="font-semibold mt-4 mb-2">13. NOTICES</h5>
      <p className="mb-2">Any notice given under this Deed:</p>
      <ul className="list-disc ml-6 mb-4">
        <li>
          Must be in writing addressed to the intended recipient at
          the address shown below or the address last notified by the
          intended recipient to the sender:
        </li>
      </ul>

      <p className="mb-2 font-semibold">Disclosing Party</p>
      <p className="mb-1">
        Load Link Australia Pty Limited & Fortis Fundamenta Pty Ltd
        atf the Fortis Fundamenta Trust
      </p>
      <p className="mb-1">
        Unit 44/211 Brisbane Road Biggera Waters, Queensland 4216
      </p>
      <p className="mb-1">Attention: Mr Anthony Kosseris</p>
      <p className="mb-4">Email: anthony@loadlink.com.au</p>

      <p className="mb-2 font-semibold">Recipient</p>
      <p className="mb-1">
        {companyName || "[Your Company]"}
      </p>
      <p className="mb-1">
        {street || "___"}, {state || "___"}{" "}
        {postcode || "___"}
      </p>
      <p className="mb-1">Attention: {repName || "___"}</p>
      <p className="mb-4">Email: {email || "___"}</p>

      <ul className="list-disc ml-6 mb-4">
        <li>
          Must be signed by a person duly authorised by the sender;
        </li>
        <li>
          Will be taken to have been given when delivered, received or
          left at the above address. If delivery or receipt occurs on
          a day when business is not generally carried on in the place
          to which the notice is sent, or is later than 4.00 pm (local
          time), it will be taken to have been duly given at the
          commencement of business on the next day when business is
          generally carried on in that place.
        </li>
      </ul>
      <h5 className="font-semibold mt-4 mb-2">14. AMENDMENT</h5>
      <p className="mb-4">
        This Deed may be amended only by another deed executed by all
        parties.
      </p>

      <h5 className="font-semibold mt-4 mb-2">15. NO WAIVER</h5>
      <p className="mb-4">
        No failure to exercise and no delay in exercising any right,
        power or remedy under this Deed will operate as a waiver. Nor
        will any single or partial exercise of any right, power or
        remedy preclude any other or further exercise of that or any
        other right, power or remedy.
      </p>

      <h5 className="font-semibold mt-4 mb-2">
        16. STAMP DUTY AND COSTS
      </h5>
      <p className="mb-4">
        Each party shall bear its own costs arising out of the
        preparation of this Deed. All stamp duty chargeable on this
        Deed shall be borne by the Recipient. The Recipient shall
        indemnify the Disclosing Party on demand against any liability
        for that stamp duty.
      </p>

      <h5 className="font-semibold mt-4 mb-2">17. GOVERNING LAW</h5>
      <p className="mb-4">
        This Deed is governed by the laws in force in Queensland. Each
        party irrevocably and unconditionally submits to the
        non-exclusive jurisdiction of the courts exercising
        jurisdiction there.
      </p>

      <h5 className="font-semibold mt-4 mb-2">18. COUNTERPARTS</h5>
      <p className="mb-4">
        This Deed may be executed in any number of counterparts. All
        counterparts taken together will be taken to constitute one
        instrument.
      </p>

      <p className="text-xs text-gray-500 mt-8 italic">
        This deed is generated dynamically based on your onboarding
        details and reflects the full legal agreement between parties.
        Please ensure all fields are accurate before signing.
      </p>
    </div>
  );
}
