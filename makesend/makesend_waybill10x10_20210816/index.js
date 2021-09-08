window.onload = async () => {
  const buttons = document.getElementById('buttonDiv');
  buttons.addEventListener('click', () => {
    buttons.style.display = 'none';
    setTimeout(function () {
      window.print();
      setTimeout(function () {
        buttons.style.display = 'block';
      }, 300);
    }, 300);
  });
};

async function requestWaybills() {
  const waybills = mockupData();
  console.log(waybills);
  if (waybills.length) {
    let viewPageData = [];
    waybills.forEach(function (waybill, index) {
      const addressMaxLen = 82;
      const senderAddressMaxLen = 82;
      const receiverNameMaxLen = 26;
      const noteMaxLen = 16;
      let branchAddress = `${waybill.branch.address} ${waybill.branch.province} ${waybill.branch.postcode}`;
      branchAddress = truncation(branchAddress, addressMaxLen);
      let receiverName = truncation(waybill.receiver.name, receiverNameMaxLen);
      let senderAddress = truncation(
        waybill.sender.address,
        senderAddressMaxLen
      );
      let receiverAddress = truncation(waybill.receiver.address, addressMaxLen);
      let note = truncation(waybill.note, noteMaxLen);
      const pickupStr = pickupRound(waybill.pickup_round);

      let content = '';
      content = `
                <div class="waybill" data-trackingid="${waybill.shipmentID}">
                    <div class="ms_logo">
                        <img src="assets/makesend_logo.png" alt="makesend_logo">
                    </div>
                    <div class="msgo">
                        <div>
                            <div style="font-size: 36px; font-weight: bold;">PICKUP</div>
                        </div>
                    </div>
                    <div class="tracking">
                        <div class="tracking__qr" id="${waybill.shipmentID}_qr">
                        </div>
                        <div class="tracking__id">${waybill.shipmentID}</div>
                    </div>
                    <div class="receiver">
                        <div class="header receiver_header">รายละเอียดผู้รับ</div> <!-- receiver -->
                        <div class="receiver_info">
                            <div class="receiver_info__name">
                                <div>ชื่อผู้รับ</div>
                                <div>${receiverName}</div>
                            </div>
                            <div class="receiver_info__address">
                                <div>ที่อยู่ผู้รับ</div>
                                <div>${receiverAddress}</div>
                            </div>
                            <div class="receiver_info__district">
                                <div>เขต</div>
                                <div>${waybill.receiver.district}</div>
                            </div>
                            <div class="receiver_info__province">
                                <div>จังหวัด</div>
                                <div>${waybill.receiver.province} ${
        waybill.receiver.postcode
      }</div>
                            </div>
                            <div class="receiver_info__phone">
                                <div>เบอร์ผู้รับ</div>
                                <div>${waybill.receiver.contact}</div>
                            </div>
                        </div>
                    </div>
                    <div class="sender sender_top">
                        <div class="header sender_top__header">รายละเอียดผู้ส่ง</div>
                        <div class="sender_top__content parcel_service_date">
                            <div class="parcel_service_date__header">
                                วันที่ ทำรายการ
                            </div>
                            <div class="parcel_service_date__content">
                                ${waybill.serviceDate}
                            </div>
                        </div>
                    </div>
                    <div class="parcel_meta parcel_meta_top">
                        <div class="header parcel_meta_top__header">รายละเอียดพัสดุ</div>
                        <div class="parcel_meta_top__content">
                            <div>
                                <div class="parcel_amount">
                                    <div class="parcel_amount__header">ชิ้นที่</div>
                                    <div class="parcel_amount__content">${
                                      index + 1
                                    } / ${waybills.length}</div>
                                </div>
                                <div class="parcel_size">
                                    <div class="parcel_size__header">ขนาด</div>
                                    <div class="parcel_size__content">${
                                      waybill.parcelSize
                                    }</div>
                                </div>
                            </div>
                            <div class="parcel_type">
                                <div class="parcel_type__header">ประเภทพัสดุ</div>
                                <div class="parcel_type__content">${
                                  waybill.parcelType ? waybill.parcelType : ''
                                }</div>
                            </div>
                        </div>
                    </div>
                    <div class="sender sender_bottom sender_info">
                        <div class="sender_info__name">
                            <div>ชื่อผู้ส่ง</div>
                            <div>${waybill.sender.name}</div>
                        </div>
                        <div class="sender_info__address">
                            <div>ที่อยู่ผู้ส่ง</div>
                            <div>${senderAddress}</div>
                        </div>
                        <div class="sender_info__phone">
                            <div>เบอร์ผู้ส่ง</div>
                            <div>${waybill.sender.contact}</div>
                        </div>
                        <div class="sender_info__note">
                            <div>หมายเหตุ</div>
                            <div>${note}</div>
                        </div>
                    </div>
                    <div class="parcel_meta parcel_meta_bottom">
                        <div class="extra_service">
                            <div class="extra_service__temp">
                                <div></div>
                                <div>${
                                  waybill.temp === 0
                                    ? 'ส่งแบบปกติ'
                                    : 'ควบคุมอุณภูมิ'
                                }</div>
                            </div>
                            <div class="extra_service__cod">
                                <div>มีเก็บเงินปลายทาง</div>
                                <div>COD: ${waybill.cod} บาท</div>
                            </div>
                        </div>
                        <div class="parcel_delivery">
                            <div class="parcel_delivery__pickup">
                                <div>พัสดุเข้ารับรอบ : </div>
                                <div>${pickupStr} </div>
                            </div>
                            <div class="parcel_delivery__dropoff">
                                <div>พัสดุต้องนำส่งก่อน : </div>
                                <div>22.00 น.</div>
                            </div>
                        </div>
                        <div class="parcel_round">
                            <div id="hub_dropoff_round_${
                              waybill.shipmentID
                            }"></div>
                            <div class="hub_transfer" id="hub_transfer_${
                              waybill.shipmentID
                            }">
                                <div>HUB</div>
                            </div>
                        </div>
                    </div>
                </div>
                <br>
                <br>
                `;
      viewPageData.push(content);
    });
    content = viewPageData.join('');
  } else {
    content = `ไม่มีข้อมูลออเดอร์`;
  }
  $('.container').html(content);
  // $('.container').prepend(content);
  const typeNumber = 0;
  const errorCorrectionLevel = 'L';
  for (let i = 0; i < waybills.length; i++) {
    let qr = qrcode(typeNumber, errorCorrectionLevel);
    qr.addData(
      `https://app.makesend.asia/tracking?t=${waybills[i].shipmentID}`
    );
    qr.make();
    document.getElementById(`${waybills[i].shipmentID}_qr`).innerHTML =
      qr.createImgTag(4, 0, 'qr_code');
  }
  try {
    updateHubTransfer(waybills);
    updateDropoffRound(waybills);
  } catch (err) {
    console.log(`hub transfer isn't updated successfully`);
    console.log(err);
  }
}

function mockupData() {
  return [
    {
      orderID: 'MS2108240842434',
      invoiceID: 'INV2108240842438',
      shipmentID: 'EX2108240842885',
      serviceDate: '2021-08-24',
      createdTime: '2021-08-24T01:42:57.000000Z',
      cod: 0,
      pickup_round: 4,
      express: 0,
      temp: 0,
      fragile: false,
      note: '0',
      sender: {
        name: 'หญิง',
        contact: '0888981414',
        address: '-',
        district: '-',
        province: '-',
        postcode: '0',
      },
      receiver: {
        name: 'ปรียาภา สืบสาย',
        contact: '0629822441',
        address:
          '174/589 (ตึกA) เดอะทรี อินเตอร์เชนจ์ ถนนประชาราษฏร์2 เเขวงบางซื่อ',
        district: 'บางซื่อ',
        province: 'กรุงเทพ',
        postcode: '10800',
      },
      branch: {
        contact: '+66639641415',
        address: '414 ซอยอ่อนนุช39 แขวงสวนหลวง',
        district: 'สวนหลวง',
        province: 'กรุงเทพ',
        postcode: '10250',
        name: 'SM 0290 ชิปป์สไมล์ อ่อนนุช 39',
      },
      parcelSize: 's60',
    },
    {
      orderID: 'MS2108240842434',
      invoiceID: 'INV2108240842438',
      shipmentID: 'EX2108240842162',
      serviceDate: '2021-08-24',
      createdTime: '2021-08-24T01:42:57.000000Z',
      cod: 0,
      pickup_round: 4,
      express: 0,
      temp: 0,
      fragile: false,
      note: '0',
      sender: {
        name: 'หญิง',
        contact: '0888981414',
        address: '-',
        district: '-',
        province: '-',
        postcode: '0',
      },
      receiver: {
        name: 'นันทนัช เรืองขำ',
        contact: '0922545316',
        address: '333/140 The Maple at Ratchada ซอยลาดพร้าว26 แขวงจอมพล',
        district: 'จตุจักร',
        province: 'กรุงเทพ',
        postcode: '10900',
      },
      branch: {
        contact: '+66639641415',
        address: '414 ซอยอ่อนนุช39 แขวงสวนหลวง',
        district: 'สวนหลวง',
        province: 'กรุงเทพ',
        postcode: '10250',
        name: 'SM 0290 ชิปป์สไมล์ อ่อนนุช 39',
      },
      parcelSize: 's60',
    },
    {
      orderID: 'MS2108240842434',
      invoiceID: 'INV2108240842438',
      shipmentID: 'EX2108240842506',
      serviceDate: '2021-08-24',
      createdTime: '2021-08-24T01:42:57.000000Z',
      cod: 0,
      pickup_round: 4,
      express: 0,
      temp: 0,
      fragile: false,
      note: '0',
      sender: {
        name: 'หญิง',
        contact: '0888981414',
        address: '-',
        district: '-',
        province: '-',
        postcode: '0',
      },
      receiver: {
        name: 'เกวลิน ชมพูนุชธานินทร์',
        contact: '0817000411',
        address: 'เลขที่ 7 หมู่บ้านนวธานี ซ.3 ถ.เสรีไทย แขวงคลองกุ่ม',
        district: 'บึงกุ่ม',
        province: 'กรุงเทพ',
        postcode: '10240',
      },
      branch: {
        contact: '+66639641415',
        address: '414 ซอยอ่อนนุช39 แขวงสวนหลวง',
        district: 'สวนหลวง',
        province: 'กรุงเทพ',
        postcode: '10250',
        name: 'SM 0290 ชิปป์สไมล์ อ่อนนุช 39',
      },
      parcelSize: 's60',
    },
    {
      orderID: 'MS2108240842434',
      invoiceID: 'INV2108240842438',
      shipmentID: 'EX2108240842343',
      serviceDate: '2021-08-24',
      createdTime: '2021-08-24T01:42:58.000000Z',
      cod: 0,
      pickup_round: 4,
      express: 0,
      temp: 0,
      fragile: false,
      note: '0',
      sender: {
        name: 'หญิง',
        contact: '0888981414',
        address: '-',
        district: '-',
        province: '-',
        postcode: '0',
      },
      receiver: {
        name: 'รพิชญา รุจวรศิวา',
        contact: '0893363888',
        address: '18/110 มบ.นิรันดร์อเวนิว ซ.รามคำแหง174',
        district: 'มีนบุรี',
        province: 'กรุงเทพ',
        postcode: '10510',
      },
      branch: {
        contact: '+66639641415',
        address: '414 ซอยอ่อนนุช39 แขวงสวนหลวง',
        district: 'สวนหลวง',
        province: 'กรุงเทพ',
        postcode: '10250',
        name: 'SM 0290 ชิปป์สไมล์ อ่อนนุช 39',
      },
      parcelSize: 's80',
    },
    {
      orderID: 'MS2108240842434',
      invoiceID: 'INV2108240842438',
      shipmentID: 'EX2108240842243',
      serviceDate: '2021-08-24',
      createdTime: '2021-08-24T01:42:58.000000Z',
      cod: 0,
      pickup_round: 4,
      express: 0,
      temp: 0,
      fragile: false,
      note: '0',
      sender: {
        name: 'หญิง',
        contact: '0888981414',
        address: '-',
        district: '-',
        province: '-',
        postcode: '0',
      },
      receiver: {
        name: 'สุกัญญา คงผึ้ง',
        contact: '0840880822',
        address: '299/820 ศุภาลัย เวอเรนด้า รัตนาธิเบศร์ ต.บางกระสอ',
        district: 'เมืองนนทบุรี',
        province: 'นนทบุรี',
        postcode: '11000',
      },
      branch: {
        contact: '+66639641415',
        address: '414 ซอยอ่อนนุช39 แขวงสวนหลวง',
        district: 'สวนหลวง',
        province: 'กรุงเทพ',
        postcode: '10250',
        name: 'SM 0290 ชิปป์สไมล์ อ่อนนุช 39',
      },
      parcelSize: 's60',
    },
    {
      orderID: 'MS2108240842434',
      invoiceID: 'INV2108240842438',
      shipmentID: 'EX2108240842385',
      serviceDate: '2021-08-24',
      createdTime: '2021-08-24T01:42:58.000000Z',
      cod: 0,
      pickup_round: 4,
      express: 0,
      temp: 0,
      fragile: false,
      note: '0',
      sender: {
        name: 'หญิง',
        contact: '0888981414',
        address: '-',
        district: '-',
        province: '-',
        postcode: '0',
      },
      receiver: {
        name: 'ทิพวรรณ  โพธิ์ขาว',
        contact: '0804829161',
        address: 'ทีเคคลินิกเวชกรรม  37/160 หมู่ 6 ตำบล คลองหนึ่ง',
        district: 'คลองหลวง',
        province: 'ปทุมธานี',
        postcode: '12120',
      },
      branch: {
        contact: '+66639641415',
        address: '414 ซอยอ่อนนุช39 แขวงสวนหลวง',
        district: 'สวนหลวง',
        province: 'กรุงเทพ',
        postcode: '10250',
        name: 'SM 0290 ชิปป์สไมล์ อ่อนนุช 39',
      },
      parcelSize: 's60',
    },
    {
      orderID: 'MS2108240842434',
      invoiceID: 'INV2108240842438',
      shipmentID: 'EX2108240842586',
      serviceDate: '2021-08-24',
      createdTime: '2021-08-24T01:42:59.000000Z',
      cod: 0,
      pickup_round: 4,
      express: 0,
      temp: 0,
      fragile: false,
      note: '0',
      sender: {
        name: 'หญิง',
        contact: '0888981414',
        address: '-',
        district: '-',
        province: '-',
        postcode: '0',
      },
      receiver: {
        name: 'กัลยกร',
        contact: '0826556424',
        address:
          '2/5อาคาร การเด้น ทาวเวอร์ ชั้น 35 ถนนบางนา กม 6.5 แขวงบางแก้ว',
        district: 'อำเภอบางพลี',
        province: 'สมุทรปราการ',
        postcode: '10540',
      },
      branch: {
        contact: '+66639641415',
        address: '414 ซอยอ่อนนุช39 แขวงสวนหลวง',
        district: 'สวนหลวง',
        province: 'กรุงเทพ',
        postcode: '10250',
        name: 'SM 0290 ชิปป์สไมล์ อ่อนนุช 39',
      },
      parcelSize: 's80',
    },
    {
      orderID: 'MS2108240842434',
      invoiceID: 'INV2108240842438',
      shipmentID: 'EX2108240842650',
      serviceDate: '2021-08-24',
      createdTime: '2021-08-24T01:42:59.000000Z',
      cod: 0,
      pickup_round: 4,
      express: 0,
      temp: 0,
      fragile: false,
      note: '0',
      sender: {
        name: 'หญิง',
        contact: '0888981414',
        address: '-',
        district: '-',
        province: '-',
        postcode: '0',
      },
      receiver: {
        name: 'ภาริตา ไตรสุทธิ์',
        contact: '0946426924',
        address: '71/16 โมดิซคอนโด ซ.ลาดพร้าว18 ถ.ลาดพร้าว จอมพล',
        district: 'จตุจักร',
        province: 'กรุงเทพ',
        postcode: '10900',
      },
      branch: {
        contact: '+66639641415',
        address: '414 ซอยอ่อนนุช39 แขวงสวนหลวง',
        district: 'สวนหลวง',
        province: 'กรุงเทพ',
        postcode: '10250',
        name: 'SM 0290 ชิปป์สไมล์ อ่อนนุช 39',
      },
      parcelSize: 's60',
    },
    {
      orderID: 'MS2108240842434',
      invoiceID: 'INV2108240842438',
      shipmentID: 'EX2108240842380',
      serviceDate: '2021-08-24',
      createdTime: '2021-08-24T01:42:59.000000Z',
      cod: 0,
      pickup_round: 4,
      express: 0,
      temp: 0,
      fragile: false,
      note: '0',
      sender: {
        name: 'หญิง',
        contact: '0888981414',
        address: '-',
        district: '-',
        province: '-',
        postcode: '0',
      },
      receiver: {
        name: 'ธนิตา ชื่นศิริพงศ์พันธุ์',
        contact: '0804528695',
        address:
          'ส่ง อาคารชุดลุมพินีวิลล์ อ่อนนุช ลาดกระบัง 1 เลขที่ 66/22 (ตึก A) แขวงลาดกระบัง',
        district: 'ลาดกระบัง',
        province: 'กรุงเทพ',
        postcode: '10520',
      },
      branch: {
        contact: '+66639641415',
        address: '414 ซอยอ่อนนุช39 แขวงสวนหลวง',
        district: 'สวนหลวง',
        province: 'กรุงเทพ',
        postcode: '10250',
        name: 'SM 0290 ชิปป์สไมล์ อ่อนนุช 39',
      },
      parcelSize: 's60',
    },
    {
      orderID: 'MS2108240842434',
      invoiceID: 'INV2108240842438',
      shipmentID: 'EX2108240843641',
      serviceDate: '2021-08-24',
      createdTime: '2021-08-24T01:43:00.000000Z',
      cod: 0,
      pickup_round: 4,
      express: 0,
      temp: 0,
      fragile: false,
      note: '0',
      sender: {
        name: 'หญิง',
        contact: '0888981414',
        address: '-',
        district: '-',
        province: '-',
        postcode: '0',
      },
      receiver: {
        name: 'จารุพัฒน์ เชาวน์วุฒิวงศ์',
        contact: '0868995425',
        address: '111 ซอยตากสิน18 ถนนตากสิน แขวงบุคคโล',
        district: 'ธนบุรี',
        province: 'กรุงเทพ',
        postcode: '10600',
      },
      branch: {
        contact: '+66639641415',
        address: '414 ซอยอ่อนนุช39 แขวงสวนหลวง',
        district: 'สวนหลวง',
        province: 'กรุงเทพ',
        postcode: '10250',
        name: 'SM 0290 ชิปป์สไมล์ อ่อนนุช 39',
      },
      parcelSize: 's60',
    },
    {
      orderID: 'MS2108240842434',
      invoiceID: 'INV2108240842438',
      shipmentID: 'EX2108240843509',
      serviceDate: '2021-08-24',
      createdTime: '2021-08-24T01:43:00.000000Z',
      cod: 0,
      pickup_round: 4,
      express: 0,
      temp: 0,
      fragile: false,
      note: '0',
      sender: {
        name: 'หญิง',
        contact: '0888981414',
        address: '-',
        district: '-',
        province: '-',
        postcode: '0',
      },
      receiver: {
        name: 'ชนม์ณนันท์ เสวตวงษ์',
        contact: '0912651464',
        address:
          '14/286 หมู่บ้านเดอะวิลล่ารามอินทรา ซ.คู้บอน 27 แยก 10 แขวงท่าแร้ง',
        district: 'บางเขน',
        province: 'กรุงเทพ',
        postcode: '10220',
      },
      branch: {
        contact: '+66639641415',
        address: '414 ซอยอ่อนนุช39 แขวงสวนหลวง',
        district: 'สวนหลวง',
        province: 'กรุงเทพ',
        postcode: '10250',
        name: 'SM 0290 ชิปป์สไมล์ อ่อนนุช 39',
      },
      parcelSize: 's60',
    },
    {
      orderID: 'MS2108240842434',
      invoiceID: 'INV2108240842438',
      shipmentID: 'EX2108240843160',
      serviceDate: '2021-08-24',
      createdTime: '2021-08-24T01:43:00.000000Z',
      cod: 0,
      pickup_round: 4,
      express: 0,
      temp: 0,
      fragile: false,
      note: '0',
      sender: {
        name: 'หญิง',
        contact: '0888981414',
        address: '-',
        district: '-',
        province: '-',
        postcode: '0',
      },
      receiver: {
        name: 'บรรณพร สุวรรณวิภัช',
        contact: '0864693545',
        address:
          '281/49 หมู่บ้านแกรนด์ไอดีไซน์ ถ.วิภาวดีรังสิต  แขวงสนามบิน (ฝากไว้ที่ป้อมยามได้เลยค่ะ)',
        district: 'ดอนเมือง',
        province: 'กรุงเทพ',
        postcode: '10210',
      },
      branch: {
        contact: '+66639641415',
        address: '414 ซอยอ่อนนุช39 แขวงสวนหลวง',
        district: 'สวนหลวง',
        province: 'กรุงเทพ',
        postcode: '10250',
        name: 'SM 0290 ชิปป์สไมล์ อ่อนนุช 39',
      },
      parcelSize: 's60',
    },
    {
      orderID: 'MS2108240842434',
      invoiceID: 'INV2108240842438',
      shipmentID: 'EX2108240843343',
      serviceDate: '2021-08-24',
      createdTime: '2021-08-24T01:43:01.000000Z',
      cod: 0,
      pickup_round: 4,
      express: 0,
      temp: 0,
      fragile: false,
      note: '0',
      sender: {
        name: 'หญิง',
        contact: '0888981414',
        address: '-',
        district: '-',
        province: '-',
        postcode: '0',
      },
      receiver: {
        name: 'อรพรรณ ชยานุวัฒน์',
        contact: '0918285208',
        address: 'จัดส่งที่ 865/45 หมู่บ้าน บ้าน365 ถนนพระรามสาม แขวงบางโพงพาง',
        district: 'ยานนาวา',
        province: 'กรุงเทพ',
        postcode: '10120',
      },
      branch: {
        contact: '+66639641415',
        address: '414 ซอยอ่อนนุช39 แขวงสวนหลวง',
        district: 'สวนหลวง',
        province: 'กรุงเทพ',
        postcode: '10250',
        name: 'SM 0290 ชิปป์สไมล์ อ่อนนุช 39',
      },
      parcelSize: 's60',
    },
    {
      orderID: 'MS2108240842434',
      invoiceID: 'INV2108240842438',
      shipmentID: 'EX2108240843397',
      serviceDate: '2021-08-24',
      createdTime: '2021-08-24T01:43:01.000000Z',
      cod: 0,
      pickup_round: 4,
      express: 0,
      temp: 0,
      fragile: false,
      note: '0',
      sender: {
        name: 'หญิง',
        contact: '0888981414',
        address: '-',
        district: '-',
        province: '-',
        postcode: '0',
      },
      receiver: {
        name: 'บุณฑริกา มลิชัย',
        contact: '0856164554',
        address: '153/295 Inizio2 ซ.12 ถ.สำเร็จพัฒนา ศาลากลาง',
        district: 'บางกรวย',
        province: 'นนทบุรี',
        postcode: '11130',
      },
      branch: {
        contact: '+66639641415',
        address: '414 ซอยอ่อนนุช39 แขวงสวนหลวง',
        district: 'สวนหลวง',
        province: 'กรุงเทพ',
        postcode: '10250',
        name: 'SM 0290 ชิปป์สไมล์ อ่อนนุช 39',
      },
      parcelSize: 's60',
    },
    {
      orderID: 'MS2108240842434',
      invoiceID: 'INV2108240842438',
      shipmentID: 'EX2108240843471',
      serviceDate: '2021-08-24',
      createdTime: '2021-08-24T01:43:02.000000Z',
      cod: 0,
      pickup_round: 4,
      express: 0,
      temp: 0,
      fragile: false,
      note: '0',
      sender: {
        name: 'หญิง',
        contact: '0888981414',
        address: '-',
        district: '-',
        province: '-',
        postcode: '0',
      },
      receiver: {
        name: 'ประภาพร วัฒนะชีวะกุล',
        contact: '0969645561',
        address: '43/157 หมู่16 ต.บึงคำพร้อย',
        district: 'ลำลูกกา',
        province: 'ปทุมธานี',
        postcode: '12150',
      },
      branch: {
        contact: '+66639641415',
        address: '414 ซอยอ่อนนุช39 แขวงสวนหลวง',
        district: 'สวนหลวง',
        province: 'กรุงเทพ',
        postcode: '10250',
        name: 'SM 0290 ชิปป์สไมล์ อ่อนนุช 39',
      },
      parcelSize: 's60',
    },
    {
      orderID: 'MS2108240842434',
      invoiceID: 'INV2108240842438',
      shipmentID: 'EX2108240843280',
      serviceDate: '2021-08-24',
      createdTime: '2021-08-24T01:43:02.000000Z',
      cod: 0,
      pickup_round: 4,
      express: 0,
      temp: 0,
      fragile: false,
      note: '0',
      sender: {
        name: 'หญิง',
        contact: '0888981414',
        address: '-',
        district: '-',
        province: '-',
        postcode: '0',
      },
      receiver: {
        name: 'พัชรี กรองแก้ว',
        contact: '0929294665',
        address: '220/146 มบ.เพ็ญโก้วิลล์ ซ.2 ถ.ศรีนครินทร์',
        district: 'อำเภอเมืองสมุทรปราการ',
        province: 'สมุทรปราการ',
        postcode: '10270',
      },
      branch: {
        contact: '+66639641415',
        address: '414 ซอยอ่อนนุช39 แขวงสวนหลวง',
        district: 'สวนหลวง',
        province: 'กรุงเทพ',
        postcode: '10250',
        name: 'SM 0290 ชิปป์สไมล์ อ่อนนุช 39',
      },
      parcelSize: 's60',
    },
  ];
}

function truncation(text, length) {
  if (text.length > length) {
    let truncated = text.split('').slice(0, length).join('');
    return truncated;
  }
  return text;
}

function pickupRound(round) {
  let timeRange = '';
  switch (round) {
    case 1:
    case 4:
    case 7:
      timeRange = '08:00 - 10:00';
      break;
    case 2:
    case 5:
    case 8:
      timeRange = '10:00 - 12:00';
      break;
    case 3:
    case 6:
    case 9:
      timeRange = '12:00 - 14:00';
      break;
    default:
  }
  return timeRange;
}
