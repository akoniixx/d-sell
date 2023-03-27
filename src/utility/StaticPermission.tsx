export const websiteBackOffice = {
  orderManagement: [
    {
      label: "View Detail",
      value: "view",
    },

    {
      label: "Edit Status",
      value: "edit",
    },
  ],
  specialRequest: [
    {
      label: "View Detail",
      value: "view",
    },
    {
      label: "Approve Order",
      value: "edit",
    },
  ],
  promotionSetting: [
    {
      label: "View Detail",
      value: "view",
    },
    {
      label: "Create Promotion",
      value: "create",
    },
    {
      label: "Edit Promotion",
      value: "edit",
    },
    {
      label: "Delete Promotion",
      value: "delete",
    },
  ],
  discountCo: [
    {
      label: "View Detail",
      value: "view",
    },
    {
      label: "Create Discount",
      value: "create",
    },
    {
      label: "Edit Discount",
      value: "edit",
    },
    {
      label: "Delete Discount",
      value: "delete",
    },
  ],
  priceListX10: [
    { label: "View Price List", value: "view" },
    {
      label: "Create Price List",
      value: "create",
    },
    {
      label: "Edit Price List",
      value: "edit",
    },
    {
      label: "Delete Price List",
      value: "delete",
    },
  ],
  saleManagement: [
    {
      label: "View Detail",
      value: "view",
    },
    {
      label: "Create User",
      value: "create",
    },
    {
      label: "Edit User",
      value: "edit",
    },
    {
      label: "Delete User",
      value: "delete",
    },
  ],
  roleManagement: [
    {
      label: "View Role",
      value: "view",
    },
    {
      label: "Create Role",
      value: "create",
    },
    {
      label: "Edit Role",
      value: "edit",
    },
    {
      label: "Delete Role",
      value: "delete",
    },
  ],
  productManagement: [
    {
      label: "View Product",
      value: "view",
    },
    {
      label: "Edit Product",
      value: "edit",
    },
  ],
};

interface NestedList {
  label: string;
  value: string;
}

interface Group {
  groupNameNested?: string;
  listNested: NestedList[];
}

interface MainList {
  label?: string;
  value?: string;
  groupNameNested?: string;
  listNested?: NestedList[];
}

interface RoleGroup {
  isNested?: boolean;
  groupName: string;
  list: (MainList | Group)[];
}

interface StaticRoles {
  [key: string]: RoleGroup;
}

export const staticRolesObject: StaticRoles = {
  // Common
  manageOrder: {
    groupName: "จัดการคำสั่งซื้อ",
    list: [
      {
        label: "ดูคำสั่งซื้อ",
        value: "viewOrder",
      },
      {
        label: "จัดการคำสั่งซื้อ",
        value: "manageOrder",
      },
      {
        label: "เชื่อมต่อ Navision",
        value: "connectNavision",
      },
    ],
  },
  specialRequest: {
    groupName: "อนุมัติคำสั่งซื้อ (Special Request)",
    list: [
      {
        label: "ดูคำสั่งซื้อ",
        value: "viewOrder",
      },
      {
        label: "อนุมัติ/ ยกเลิก คำสั่งซื้อ",
        value: "approveOrder",
      },
    ],
  },
  productList: {
    groupName: "รายการสินค้า",
    list: [
      {
        label: "ดูสินค้า",
        value: "viewProduct",
      },
      {
        label: "แก้ไขสินค้า",
        value: "editProduct",
      },
      {
        label: "เชื่อมต่อ Navision",
        value: "connectNavision",
      },
    ],
  },
  priceSpecialExclusive: {
    groupName: "ราคาสินค้าเฉพาะร้าน",
    list: [
      {
        label: "ดูราคาสินค้า",
        value: "viewPrice",
      },
      {
        label: "สร้างราคาสินค้า",
        value: "createPrice",
      },
      {
        label: "แก้ไขราคาสินค้า",
        value: "editPrice",
      },
      {
        label: "ลบราคาสินค้า",
        value: "deletePrice",
      },
    ],
  },
  promotionSetting: {
    groupName: "ตั้งค่าโปรโมชั่น",
    list: [
      {
        label: "ดูโปรโมชั่น",
        value: "viewPromotion",
      },
      {
        label: "สร้างโปรโมชั่น",
        value: "createPromotion",
      },
      {
        label: "แก้ไขโปรโมชั่น",
        value: "editPromotion",
      },
      {
        label: "ลบโปรโมชั่น",
        value: "deletePromotion",
      },
    ],
  },
  freebieList: {
    groupName: "รายการของแถม",
    list: [
      {
        label: "ดูรายการของแถม",
        value: "viewFreebie",
      },
      {
        label: "แก้ไขของแถม",
        value: "editFreebie",
      },
    ],
  },
  discountCo: {
    isNested: true,
    groupName: "ส่วนลดดูแลราคา",
    list: [
      {
        label: "รายการส่วนลด",
        groupNameNested: "distcountList",
        listNested: [
          {
            label: "ดูรายการส่วนลด",
            value: "viewDiscount",
          },
          {
            label: "สร้างรายการส่วนลด",
            value: "createDiscount",
          },
          {
            label: "แก้ไขรายการส่วนลด",
            value: "editDiscount",
          },
          {
            label: "ลบรายการส่วนลด",
            value: "deleteDiscount",
          },
        ],
      },
      {
        label: "ส่วนลดดูแลราคารายร้าน",
        groupNameNested: "manageConditionStore",

        listNested: [
          {
            label: "ดูรายการส่วนลด",
            value: "viewDiscount",
          },
          {
            label: "สร้างรายการส่วนลด",
            value: "createDiscount",
          },
          {
            label: "แก้ไขรายการส่วนลด",
            value: "editDiscount",
          },
          {
            label: "ลบรายการส่วนลด",
            value: "deleteDiscount",
          },
        ],
      },
      {
        groupNameNested: "manageCondition",
        label: "จัดการเงื่อนไขดูแลราคา",
        listNested: [
          {
            label: "ดูเงื่อนไข",
            value: "viewCondition",
          },
          {
            label: "สร้างเงื่อนไข",
            value: "createCondition",
          },
          {
            label: "แก้ไขเงื่อนไข",
            value: "editCondition",
          },
          {
            label: "ลบเงื่อนไข",
            value: "deleteCondition",
          },
        ],
      },
    ],
  },
};
export const staticManageRoles: StaticRoles = {
  // Manage
  manageUser: {
    isNested: true,
    groupName: "จัดการผู้ใช้งาน",
    list: [
      {
        label: "รายชื่อผู้ใช้งาน",
        groupNameNested: "userList",
        listNested: [
          {
            label: "ดูรายชื่อผู้ใช้งาน",
            value: "viewUser",
          },
          {
            label: "เพิ่มผู้ใช้งาน",
            value: "addUser",
          },
          {
            label: "แก้ไขผู้ใช้งาน",
            value: "editUser",
          },
          {
            label: "ลบผู้ใช้งาน",
            value: "deleteUser",
          },
        ],
      },
      {
        label: "จัดการสิทธิ์",
        groupNameNested: "manageRoles",
        listNested: [
          {
            label: "ดูรายการบทบาทผู้ใช้งาน",
            value: "viewRoles",
          },
          {
            label: "เพิ่มบทบาทผู้ใช้งาน",
            value: "addRoles",
          },
          {
            label: "แก้ไขบทบาทผู้ใช้งาน",
            value: "editRoles",
          },
          {
            label: "ลบบทบาทผู้ใช้งาน",
            value: "deleteRoles",
          },
        ],
      },
    ],
  },
  manageProduct: {
    isNested: true,
    groupName: "จัดการสินค้า",
    list: [
      {
        label: "รายชื่อร้านค้า",
        groupNameNested: "storeList",
        listNested: [
          {
            label: "ดูรายชื่อร้านค้า",
            value: "viewStore",
          },
          {
            label: "สร้างร้านค้า",
            value: "createStore",
          },
          {
            label: "แก้ไขร้านค้า",
            value: "editStore",
          },
          {
            label: "ลบร้านค้า",
            value: "deleteStore",
          },
        ],
      },
      {
        label: "อนุมัติเบอร์โทรศัพท์",
        groupNameNested: "approvePhone",
        listNested: [
          {
            label: "ดูรายการอนุมัติ",
            value: "viewApprovePhone",
          },
          {
            label: "อนุมัติการเปลี่ยนเบอร์มือถือร้านค้า",
            value: "approvePhone",
          },
        ],
      },
    ],
  },
};
