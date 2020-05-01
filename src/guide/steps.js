const csr_receiving_index_steps = [
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

export { csr_receiving_index_steps }

const all_receiving_summary_steps = [
  {
    element: '#all-receiving-wo-summary',
    popover: {
      title: 'Summary part',
      description: 'This section is an overview of this order, including some basic information and status in the warehouse.',
      position: 'bottom'
    }
  },
  {
    element: '#all-receiving-wo-summary-status',
    popover: {
      title: 'Status',
      description: 'This progress bar reflects the status of this order. There are different operation options in different states.',
      position: 'bottom'
    }
  },
  {
    element: '#all-receiving-wo-summary-wo',
    popover: {
      title: 'Download Work Order',
      description: 'This function is only valid when the status is step 3 or later.',
      position: 'bottom'
    }
  },
  {
    element: '#all-receiving-wo-summary-receipt',
    popover: {
      title: 'Summary part',
      description: 'This function is only valid when the status is step 8 or later.',
      position: 'bottom'
    }
  },
  {
    element: '#all-receiving-wo-summary-board',
    popover: {
      title: 'Summary part',
      description: 'This section reflects all valid information for this order.',
      position: 'bottom'
    }
  }
]

export { all_receiving_summary_steps }

const csr_receiving_wo_control = [
  {
    element: '#csr-receiving-wo-control',
    popover: {
      title: 'Control Panel',
      description: 'As a CSR, you will be responsible for pushing the order status from step 1 to step 4 in this panel, and do the final comfirm.',
      position: 'bottom'
    }
  },
  {
    element: '#csr-receiving-wo-push',
    popover: {
      title: 'Push order to  warehouse',
      description: 'This button would be valid only when the status is step 1 or 2 and can push the order status to step 3 after uploading the packing list. Then the order will be visible(unprocessable) for the warehouse terminal, and most parts would turn to uneditable to CSR.',
      position: 'bottom'
    }
  },
  {
    element: '#csr-receiving-wo-recall',
    popover: {
      title: 'Recall order from warehouse',
      description: 'This button would be valid only when the status is step 3 or 4 and can recall the order from the warehouse terminal, then reset the status to step 1.',
      position: 'bottom'
    }
  },
  {
    element: '#csr-receiving-wo-arrive',
    popover: {
      title: 'Mark arrived date',
      description: 'This button would be valid only when the status is step 3 and can mark the actual timing the cargo arrived and push the order status to step 4. Then this order will transfer to the warehouse terminal. The arrived date is crucial to accounting and can be edit in most phases.',
      position: 'bottom'
    }
  },
  {
    element: '#csr-receiving-wo-complete',
    popover: {
      title: 'Mark completed',
      description: 'This button would be valid only when the status turns to step 8 and can mark this order completed and transfer this order to the accounting terminal. Make sure you have logged all the necessary charging notes before clicking.',
      position: 'bottom'
    }
  },
  {
    element: '#all-receiving-wo-summary-inventory',
    popover: {
      title: 'Inventory',
      description: 'You can view the inventory of this order anytime in both carton view and pallet view.',
      position: 'bottom'
    }
  }
]

export { csr_receiving_wo_control }

const all_receiving_wo_pl = [
  {
    element: '#all-receiving-wo-pl',
    popover: {
      title: 'Packing list',
      description: 'This is the packing list section of this order. You can create, edit, adjust and upload packing list here, even can upload independent label for each SKU.',
      position: 'bottom'
    }
  },
  {
    element: '#all-receiving-wo-sku',
    popover: {
      title: 'Add new sku',
      description: 'This button would be valid only when the status is step 1 or 5 and can add a new SKU under this packing list.',
      position: 'bottom'
    }
  },
  {
    element: '#all-receiving-wo-uploadpl',
    popover: {
      title: 'Upload packing list',
      description: 'This button would be valid only when the status is step 1 or 5 and provide a way to upload packing list batches(Excel file only). Any customer\'s packing list in deferent form can be translated to a standard excel file by following a special template.',
      position: 'bottom'
    }
  },
  {
    element: '#all-receiving-wo-template',
    popover: {
      title: 'Download packing list template',
      description: 'This button would be valid anytime and you can download the special template here.',
      position: 'left'
    }
  },
  {
    element: '#all-receiving-wo-pltable',
    popover: {
      title: 'Packing list',
      description: 'This is the packing list table under this order. One order would have only one packing list. Be advise adjust function woule be valid only when the status is step 5 and edit function would only be valid in step 1 and 2.',
      position: 'bottom'
    }
  }
]

export { all_receiving_wo_pl }

const csr_all_wo_instruction = [
  {
    element: '#csr-all-wo-instruction',
    popover: {
      title: 'Register notes',
      description: 'As a CSR, you need to register all operations and charges of this order in this section, and process every feedback from the warehouse. Any missing registration may cause irreparable losses, which may require the responsible person to bear all or part of them.',
      position: 'bottom'
    }
  },
  {
    element: '#csr-all-wo-instruction-new',
    popover: {
      title: 'Add new notes',
      description: 'As long as the order has not been closed, this button will always be valid. Clicking this button would open a detailed new dialog.',
      position: 'bottom'
    }
  },
  {
    element: '#csr-all-wo-instruction-reset',
    popover: {
      title: 'Reset instruction',
      description: 'This button would be valid only when the status is step 1 or 2. Clicking this button would reset the entire Notes according to the instruction template. You can edit the instruction template in Customer Manager page.',
      position: 'bottom'
    }
  },
  {
    element: '#csr-all-wo-instruction-table',
    popover: {
      title: 'Table & Details',
      description: 'You can view, update and process feedback in this table. Note once you update a instruction, the status of this instruction would reset to New.',
      position: 'top'
    }
  }
]

export { csr_all_wo_instruction }

const all_all_wo_instruction_dialog = [
  {
    element: '#all-all-wo-instruction-description',
    popover: {
      title: 'Description',
      description: 'Enter the instructions for the warehouse and the charge notes for the accounting here',
      position: 'bottom'
    }
  },
  {
    element: '#all-all-wo-instruction-instruction',
    popover: {
      title: 'Instruction',
      description: 'Instructions refer to instructions from customers. These instructions will be the basis for warehouse operations',
      position: 'bottom'
    }
  },
  {
    element: '#all-all-wo-instruction-operation',
    popover: {
      title: 'Operation',
      description: 'Operations refer to instructions from CSR. These instructions will be the basis for warehouse operations',
      position: 'bottom'
    }
  },
  {
    element: '#all-all-wo-instruction-charging',
    popover: {
      title: 'Charging',
      description: 'No matter what your role is, when you create a note, you must ensure the correctness of this field.',
      position: 'top'
    }
  }
]

export { all_all_wo_instruction_dialog }

const acct_all_invoice = [
  {
    element: '#acct-all-invoice',
    popover: {
      title: 'Invoice Section',
      description: 'If you have the permisson, you can record and export invoice excel file that can sent to customer in this section.',
      position: 'top'
    }
  },
  {
    element: '#acct-all-invoice-regular',
    popover: {
      title: 'Add regular charge',
      description: 'Regular charge refers to a chargeable service stored in this system. If you want to add a regular charge for cetain customer, fill the form in the dialoag opened by clicking this button.',
      position: 'top'
    }
  },
  {
    element: '#acct-all-invoice-extra',
    popover: {
      title: 'Add extra charge',
      description: 'Extra charge refers to a temporary or one time deal service does not stored in this system. If you want to add a extral charge for cetain customer, fill the form in the dialoag opened by clicking this button.',
      position: 'top'
    }
  },
  {
    element: '#acct-all-invoice-cost',
    popover: {
      title: 'Charging',
      description: 'If you want to add an independed cost item that does not belong to any exist operation for certion customer, fill the form in the dialog opened by clicking this button.',
      position: 'top'
    }
  },
  {
    element: '#acct-all-invoice-report',
    popover: {
      title: 'Export Invoice',
      description: 'You can export the invoice of this order only by clicking this button.',
      position: 'top'
    }
  },
  {
    element: '#acct-all-invoice-table',
    popover: {
      title: 'Invoice details',
      description: 'You can view the invoice details under this order.',
      position: 'top'
    }
  }
]

export { acct_all_invoice }
