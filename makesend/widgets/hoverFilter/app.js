$(function () {
  mountFilter({
    id: '#sender_filter_btn',
    target: 'Size',
    inputTarget: '',
    listTitle: 'Size',
    options: ['s60', 's80'],
  });
});

function mountFilter({
  id,
  target = '',
  inputTarget = '',
  options = [],
  listTitle = '',
}) {
  try {
    if (!id || !document.querySelector(id)) {
      // check if DOM exists
      throw new Error("element doesn't exist or incorrect id");
    }
    if (
      !Array.isArray(options) ||
      typeof target !== 'string' ||
      typeof listTitle !== 'string' ||
      typeof inputTarget !== 'string'
    ) {
      // type guard
      throw new Error('invalid params');
    }

    let display = 'none';
    if (options.length) {
      display = 'block';
    }

    let optionList = '';
    if (options.length) {
      optionList = options.reduce((html, option, index) => {
        html += `
        <div class="custom-control custom-checkbox">
          <input type="checkbox" value="${option}" class="custom-control-input" id="check_${index}">
          <label class="custom-control-label" for="check_${index}">${option}</label>
        </div>
        `;
        return html;
      }, '');
    }

    $(id).popover({
      animation: true,
      html: true,
      sanitize: false,
      title: `Filter By ${target}`,
      content: `
        <div class="d-flex flex-column">
          <div class="mb-3 input-group">
            <input class="d-block w-100 form-control" id="sender_filter_input" placeholder="search name" type="text" />
          </div>
          <div class="d-flex justify-content-between mb-3">
            <div class="btn btn-warning d-flex justify-content-between mr-3">
              <div class="mr-2">Sort Asc</div>
              <div><i class="fas fa-arrow-up"></i></div>
            </div>
            <div class="btn btn-warning d-flex justify-content-between">
              <div class="mr-2">Sort Desc </div>
              <div><i class="fas fa-arrow-down"></i></div>
            </div>
          </div>
          <div class="card" style="display: ${display}">
            <div class="card-header py-0"><h4 class="mb-0">${listTitle}</h4></div>
            <div class="card-body py-0">
              <div class="card-title"></div>
              <div class="card-text">${optionList}</div>
            </div>
          </div>
        </div>
      `,
    });
  } catch (err) {
    console.warn(err);
  }

  $('body').on('click', function (e) {
    if (
      $(e.target).data('toggle') !== 'popover' &&
      $(e.target).parents('[data-toggle="popover"]').length === 0 &&
      $(e.target).parents('.popover').length === 0
    ) {
      $('[data-toggle="popover"]').popover('hide');
    }
  });
}
