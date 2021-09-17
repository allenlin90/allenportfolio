$(async function (e, orderID = 'MS2109011534996') {
  $('#order_details_modal').modal('show');

  const response = await fetch(
    'https://api-merchant.makesend.ninja/api/debug/shipmentListFromOrder',
    {
      headers: {
        'ms-key': '43655de15bea494dba0ba32c99115fff',
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        orderID,
      }),
    },
  ).then((res) => res.json());

  document.querySelector('#order_loader').style.display = 'none';
  document.querySelector('#order_data').style.display = 'flex';

  if (response.resCode === 200) {
    const tbody = document.querySelector('.modal table tbody');
    let html = '';
    response.totalOrder.forEach((parcel) => {
      const {
        trackingID,
        receiverName,
        cod,
        size,
        temp,
        note,
        parcelType,
        serviceDate,
        serviceFee,
      } = parcel;
      html += `
        <tr>
          <td>${trackingID}</td>
          <td>${serviceDate}</td>
          <td>${receiverName}</td>
          <td style="text-align: center;">${
            temp === 1
              ? '<span style="color: Dodgerblue;"><i class="fas fa-snowflake"></i></span>'
              : '<span style="color: Tomato;"><i class="fas fa-thermometer-three-quarters"></i></span>'
          }</td>
          <td>${size}</td>
          <td>${new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB',
          }).format(cod / 100)}</td>
          <td>${note}</td>
          <td>${new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB',
          }).format(serviceFee / 100)}</td>
          <td>${parcelType}</td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  }

  // $('#order_details_modal').modal('hide');
});
