# encoding: utf-8
require 'oga'
require 'multi_xml'


# <?xml version="1.0" encoding="UTF-8"?>
xml_body =<<-XML
<SOAP-ENV:Envelope xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/" xmlns:SOAP-ENC="http://schemas.xmlsoap.org/soap/encoding/" xmlns:ns0="urn:HDCRMWebServiceIntf-IHDCRMWebService" xmlns:ns1="http://schemas.xmlsoap.org/soap/encoding/" xmlns:ns2="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns3="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" SOAP-ENV:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/">
   <ns2:Body>
      <ns0:LogIn>
         <sOper xsi:type="ns3:string">HDCRM[0]</sOper>
         <sStoreCode xsi:type="ns3:string">0210</sStoreCode>
         <sWorkStation xsi:type="ns3:string">172.17.104.164</sWorkStation>
         <nUserGid xsi:type="ns3:int">1000245</nUserGid>
         <sUserPwd xsi:type="ns3:string">05EC54150206B033</sUserPwd>
         <sClientCookie xsi:type="ns3:string" />
      </ns0:LogIn>
   </ns2:Body>
</SOAP-ENV:Envelope>
XML

puts MultiXml.parse(xml_body).inspect
