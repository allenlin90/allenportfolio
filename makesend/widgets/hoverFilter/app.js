$(async function () {
  closePopover();
  const store = {
    numToSort: [1, 2, 3, 4, 5],
    nameToSort: ['john doe', 'jane smith', 'foo bar'],
  };
  mountFilter({
    id: 'sender_filter_btn',
    target: 'Sender',
    inputPlaceholder: 'sender name',
    filterArray: 'nameToSort',
  });
  mountFilter({
    id: 'size_filter_btn',
    target: 'Size',
    inputPlaceholder: '',
    listTitle: 'Size',
    options: ['s60', 's80'],
    sortArray: 'numToSort',
  });
  const result = document.querySelector('#result');
  document.querySelector('#check_nums').addEventListener('click', () => {
    result.innerText = `Result ${store['numToSort']}`;
    console.log(store['numToSort']);
  });
  document.querySelector('#check_names').addEventListener('click', () => {
    result.innerText = `Result ${store['nameToSort']}`;
    console.log(store['nameToSort']);
  });

  function mountFilter({
    id,
    target = '',
    inputPlaceholder = '',
    options = [],
    listTitle = '',
    sortArray = '',
    filterArray = '',
  }) {
    try {
      const button = document.getElementById(id);
      if (!id || !button) {
        // check if DOM exists
        throw new Error("element doesn't exist or incorrect id");
      }

      if (
        !Array.isArray(options) ||
        typeof sortArray !== 'string' ||
        typeof filterArray !== 'string' ||
        typeof target !== 'string' ||
        typeof listTitle !== 'string' ||
        typeof inputPlaceholder !== 'string'
      ) {
        // type guard
        throw new Error('invalid params');
      }

      if (
        (sortArray && store[sortArray] === undefined) ||
        (filterArray && store[filterArray] === undefined)
      ) {
        throw new Error(`store properties doesn't exist!`);
      }

      let state = {
        filterArray: [],
        input: '',
      };

      if (filterArray) {
        state.filterArray = store[filterArray];
      }

      let display = 'none';
      if (options.length) {
        display = 'block';
      }

      let sortable = sortArray.length ? 'flex' : 'none';

      let inputFilter = inputPlaceholder ? 'block' : 'none';

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

      $(`#${id}`).popover({
        animation: true,
        html: true,
        sanitize: false,
        title: `${target} Filters`,
        content: `
        <div class="d-flex flex-column">
          <div class="mb-3 input-group">
            <input class="w-100 form-control" value="${state.input}" style="display: ${inputFilter}" id="${id}_input" placeholder="${inputPlaceholder}" type="text" />
          </div>
          <div class="justify-content-between mb-3" style="display: ${sortable}">
            <div class="btn btn-warning d-flex justify-content-between mr-3" id="${id}_asc">
              <div class="mr-2">Sort Asc</div>
              <div><i class="fas fa-arrow-up"></i></div>
            </div>
            <div class="btn btn-warning d-flex justify-content-between" id="${id}_desc">
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

      if (sortArray) {
        $('body').on('click', `#${id}_asc`, asc);
        $('body').on('click', `#${id}_desc`, desc);

        function asc(e) {
          store[sortArray].sort((a, b) => a - b);
        }

        function desc(e) {
          store[sortArray].sort((a, b) => b - a);
        }
      }

      if (filterArray) {
        $('body').on('input', `#${id}_input`, filterArr());
        $('body').on('click', `#${id}`, resumeArr);

        function filterArr() {
          return function (e) {
            store[filterArray] = state.filterArray.filter((item) =>
              item.includes(e.target.value)
            );
          };
        }

        function resumeArr() {
          store[filterArray] = state.filterArray;
        }
      }
    } catch (err) {
      console.warn(err);
    }
  }

  function closePopover() {
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
});
