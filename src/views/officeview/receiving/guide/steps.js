const indexSteps = [
  {
    element: '#csr-receiving-index',
    popover: {
      title: 'CSR Receiving Homepage',
      description: 'This is a CSR-only homepage, and only users with CSR authority can access it. If CSR is one of your duty and you want to establish a receipt process for your customers, then you should start here. Please follow this instruction to get the basic operation step by step.',
      position: 'bottom'
    }
  },
  {
    element: '#csr-receiving-new-inbound-order',
    popover: {
      title: 'Create a new inbound order',
      description: 'If you want to create a new inbound order, click here',
      position: 'bottom'
    }
  },
  {
    element: '#csr-receiving-sku-filter',
    popover: {
      title: 'Search orders containing certain SKU',
      description: 'If you want to serach the inbound orders containing a certain SKU, click here',
      position: 'bottom'
    }
  },
  {
    element: '#csr-receiving-reset-all',
    popover: {
      title: 'Reset all orders',
      description: 'If you want to clear all search conditions, or you think the search results are not displayed correctly, click here',
      position: 'bottom'
    }
  },
  {
    element: '#csr-receiving-search',
    popover: {
      title: 'Quick search bar',
      description: 'You can do a quick search here',
      position: 'left'
    }
  },
  {
    element: '#csr-receiving-advanced-filter',
    popover: {
      title: 'Advanced filter',
      description: 'If you want to conduct advanced search, such as filtering order results through multiple conditions and multiple choices, and want to sort the results according to your wishes, then this advanced filter can meet your needs.',
      position: 'bottom'
    }
  },
  {
    element: '#generic-filter-status',
    popover: {
      title: 'Filter status',
      description: 'Filter the status you want(Multiple choice).',
      position: 'bottom'
    }
  },
  {
    element: '#generic-filter-customer-code',
    popover: {
      title: 'Filter customer code',
      description: 'Filter the customer code you want(Multiple choice).',
      position: 'bottom'
    }
  },
  {
    element: '#generic-filter-invoice-status',
    popover: {
      title: 'Filter invoice status',
      description: 'Filter the invoice status you want(Multiple choice).',
      position: 'bottom'
    }
  },
  {
    element: '#generic-filter-sort',
    popover: {
      title: 'Sort by filed',
      description: 'Select the field you want to sort(Single choice).',
      position: 'bottom'
    }
  },
  {
    element: '#generic-filter-filter',
    popover: {
      title: 'Filter',
      description: 'Click here to apply conditions.',
      position: 'left'
    }
  },
  {
    element: '#generic-filter-reset',
    popover: {
      title: 'Reset',
      description: 'Click here to reset all conditions, including sort filed.',
      position: 'left'
    }
  },
  {
    element: '#csr-receiving-orders',
    popover: {
      title: 'Inbound orders',
      description: 'This is the main part of the inbound orders',
      position: 'buttom'
    }
  },
  {
    element: '#csr-receiving-pagenation',
    popover: {
      title: 'Pages',
      description: 'You can jump to any page you want here',
      position: 'buttom'
    }
  }
]

const woSteps = [
  {
    element: '#receiving-csr-index',
    popover: {
      title: 'CSR Receiving Homepage',
      description: 'This is a CSR-only homepage, and only users with CSR authority can access it. If you belong to CSR and want to establish a receipt process for customers, then you should start here.',
      position: 'bottom'
    }
  }
  //   {
  //     element: '#breadcrumb-container',
  //     popover: {
  //       title: 'Breadcrumb',
  //       description: 'Indicate the current page location',
  //       position: 'bottom'
  //     }
  //   },
  //   {
  //     element: '#header-search',
  //     popover: {
  //       title: 'Page Search',
  //       description: 'Page search, quick navigation',
  //       position: 'left'
  //     }
  //   },
  //   {
  //     element: '#screenfull',
  //     popover: {
  //       title: 'Screenfull',
  //       description: 'Set the page into fullscreen',
  //       position: 'left'
  //     }
  //   },
  //   {
  //     element: '#size-select',
  //     popover: {
  //       title: 'Switch Size',
  //       description: 'Switch the system size',
  //       position: 'left'
  //     }
  //   },
  //   {
  //     element: '#tags-view-container',
  //     popover: {
  //       title: 'Tags view',
  //       description: 'The history of the page you visited',
  //       position: 'bottom'
  //     },
  //     padding: 0
  //   }
]

export { indexSteps, woSteps }
