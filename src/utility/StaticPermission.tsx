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
  oneFinity: [
    {
      label: "View Setting",
      value: "view",
    },
    {
      label: "Edit Setting",
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
  groupKey: string;
  groupName: string;
  list: (MainList | Group)[];
}

interface StaticRoles {
  [key: string]: RoleGroup;
}

export const staticRolesObject: StaticRoles = {
  manageOrder: {
    groupName: "จัดการคำสั่งซื้อ",
    groupKey: "ORDER",
    list: [
      {
        label: "ดูคำสั่งซื้อ",
        value: "view",
      },
      {
        label: "แก้ไขสถานะคำสั่งซื้อ",
        value: "edit",
      },
    ],
  },
  specialRequest: {
    groupName: "อนุมัติคำสั่งซื้อ (Special Request)",
    groupKey: "SPREQ",
    list: [
      {
        label: "ดูคำสั่งซื้อ",
        value: "view",
      },
      {
        label: "อนุมัติ/ ยกเลิก คำสั่งซื้อ",
        value: "approve",
      },
    ],
  },
  productList: {
    groupName: "รายการสินค้า",
    groupKey: "PROD",
    list: [
      {
        label: "ดูสินค้า",
        value: "view",
      },
      {
        label: "แก้ไขสินค้า",
        value: "edit",
      },
      {
        label: "เชื่อมต่อ Navision",
        value: "sync",
      },
    ],
  },
  priceSpecialExclusive: {
    groupName: "ราคาสินค้า",
    groupKey: "SPPRICE",
    list: [
      {
        label: "ดูราคาสินค้า",
        value: "view",
      },
      {
        label: "สร้างราคาสินค้า",
        value: "create",
      },
      {
        label: "แก้ไขราคาสินค้า",
        value: "edit",
      },
      {
        label: "ลบราคาสินค้า",
        value: "delete",
      },
    ],
  },
  promotionSetting: {
    groupName: "ตั้งค่าโปรโมชั่น",
    groupKey: "PROMO",
    list: [
      {
        label: "สร้างโปรโมชั่น",
        value: "create",
      },
      {
        label: "ดูโปรโมชั่น",
        value: "view",
      },
      {
        label: "แก้ไขโปรโมชั่น",
        value: "edit",
      },
      {
        label: "ลบโปรโมชั่น",
        value: "delete",
      },
      {
        label: "อนุมัติโปรโมชั่น",
        value: "approve",
      },
      {
        label: "จัดการเอกสารโปรโมชั่น",
        value: "document",
      },
    ],
  },
  freebieList: {
    groupName: "รายการของแถม",
    groupKey: "FREEB",
    list: [
      {
        label: "ดูรายการของแถม",
        value: "view",
      },
      {
        label: "แก้ไขของแถม",
        value: "edit",
      },
      {
        label: "เชื่อมต่อ Navision",
        value: "sync",
      },
    ],
  },
  discountCo: {
    isNested: true,
    groupName: "ส่วนลดดูแลราคา",
    groupKey: "DISCO",
    list: [
      {
        label: "รายการส่วนลด",
        groupNameNested: "discountList",
        listNested: [
          {
            label: "สร้างรายการส่วนลด",
            value: "create",
          },
          {
            label: "ดูรายการส่วนลด",
            value: "view",
          },
          {
            label: "แก้ไขรายการส่วนลด",
            value: "edit",
          },
          {
            label: "ลบรายการส่วนลด",
            value: "delete",
          },
          {
            label: "อนุมัติรายการส่วนลด",
            value: "approve",
          },
        ],
      },
      {
        label: "ส่วนลดดูแลราคารายร้าน",
        groupNameNested: "manageConditionStore",

        listNested: [
          {
            label: "สร้างส่วนลดดูแลราคารายร้าน",
            value: "create",
          },
          {
            label: "ดูส่วนลดดูแลราคารายร้าน",
            value: "view",
          },
          {
            label: "แก้ไขส่วนลดดูแลราคารายร้าน",
            value: "edit",
          },
        ],
      },
      {
        groupNameNested: "manageCondition",
        label: "จัดการเงื่อนไขดูแลราคา",
        listNested: [
          {
            label: "สร้างจัดการเงื่อนไขดูแลราคา",
            value: "create",
          },
          {
            label: "ดูจัดการเงื่อนไขดูแลราคา",
            value: "view",
          },
          {
            label: "แก้ไขจัดการเงื่อนไขดูแลราคา",
            value: "edit",
          },
          {
            label: "ลบจัดการเงื่อนไขดูแลราคา",
            value: "delete",
          },
          {
            label: "อนุมัติจัดการเงื่อนไขดูแลราคา",
            value: "approve",
          },
        ],
      },
    ],
  },
  news: {
    isNested: true,
    groupName: "ข่าวสาร",
    groupKey: "NEWS",
    list: [
      {
        label: "รายการข่าวสาร",
        groupNameNested: "newsList",
        listNested: [
          {
            label: "สร้างรายการข่าวสาร",
            value: "create",
          },
          {
            label: "แก้ไขรายการข่าวสาร",
            value: "edit",
          },
          {
            label: "ลบรายการข่าวสาร",
            value: "delete",
          },
        ],
      },
      {
        label: "ปักหมุดข่าวสาร",
        groupNameNested: "pinedNews",
        listNested: [
          {
            label: "แก้ไขปักหมุดข่าวสาร",
            value: "edit",
          },
        ],
      },
      {
        groupNameNested: "highlightNews",
        label: "ข่าวสารไฮไลท์",
        listNested: [
          {
            label: "สร้างข่าวสารไฮไลท์",
            value: "create",
          },
          {
            label: "แก้ไขข่าวสารไฮไลท์",
            value: "edit",
          },
          {
            label: "ลบข่าวสารไฮไลท์",
            value: "delete",
          },
        ],
      },
    ],
  },
  oneFinity: {
    isNested: true,
    groupName: "ตั้งค่า",
    groupKey: "oneFinity",
    list: [
      {
        label: "แบรนด์สินค้า",
        groupNameNested: "oneFinity",
        listNested: [
          {
            label: "สร้างรายการส่วนลด",
            value: "create",
          },
          {
            label: "ดูรายการส่วนลด",
            value: "view",
          },
          {
            label: "แก้ไขรายการส่วนลด",
            value: "edit",
          },
          {
            label: "ลบรายการส่วนลด",
            value: "delete",
          },
        ],
      },
      {
        label: "จัดการร้านค้า",
        groupNameNested: "oneFinity",
        listNested: [
          {
            label: "สร้างร้านค้า",
            value: "create",
          },
          {
            label: "ดูร้านค้า",
            value: "view",
          },
          {
            label: "แก้ไขร้านค้า",
            value: "edit",
          },
          {
            label: "ลบร้านค้า",
            value: "delete",
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
    groupKey: "USER",
    list: [
      {
        label: "รายชื่อผู้ใช้งาน",
        groupNameNested: "userList",
        listNested: [
          {
            label: "ดูรายชื่อผู้ใช้งาน",
            value: "view",
          },
          {
            label: "เพิ่มผู้ใช้งาน",
            value: "create",
          },
          {
            label: "แก้ไขผู้ใช้งาน",
            value: "edit",
          },
        ],
      },
      {
        label: "จัดการสิทธิ์",
        groupNameNested: "manageRoles",
        listNested: [
          {
            label: "ดูรายการบทบาทผู้ใช้งาน",
            value: "view",
          },
          {
            label: "เพิ่มบทบาทผู้ใช้งาน",
            value: "create",
          },
          {
            label: "แก้ไขบทบาทผู้ใช้งาน",
            value: "edit",
          },
          {
            label: "ลบบทบาทผู้ใช้งาน",
            value: "delete",
          },
        ],
      },
    ],
  },
  manageStore: {
    isNested: true,
    groupName: "จัดการร้านค้า",
    groupKey: "STORE",
    list: [
      {
        label: "รายชื่อร้านค้า",
        groupNameNested: "storeList",
        listNested: [
          {
            label: "ดูรายชื่อร้านค้า",
            value: "view",
          },
          {
            label: "สร้างร้านค้า",
            value: "create",
          },
          {
            label: "แก้ไขร้านค้า",
            value: "edit",
          },
          {
            label: "เชื่อมต่อ Navision",
            value: "sync",
          },
        ],
      },
      {
        label: "อนุมัติเบอร์โทรศัพท์",
        groupNameNested: "approvePhone",
        listNested: [
          {
            label: "ดูรายการอนุมัติ",
            value: "view",
          },
          {
            label: "อนุมัติการเปลี่ยนเบอร์มือถือร้านค้า",
            value: "approve",
          },
        ],
      },
      {
        label: "จัดกลุ่มร้านค้า",
        groupNameNested: "shopGroup",
        listNested: [
          {
            label: "ดูกลุ่มร้านค้า",
            value: "view",
          },
          {
            label: "สร้างกลุ่มร้านค้า",
            value: "create",
          },
          {
            label: "แก้ไขกลุ่มร้านค้า",
            value: "edit",
          },
        ],
      },
    ],
  },
  oneFinity: {
    isNested: true,
    groupName: "ตั้งค่า",
    groupKey: "oneFinity",
    list: [
      {
        label: "แบรนด์สินค้า",
        groupNameNested: "oneFinity",
        listNested: [
          {
            label: "สร้างรายการส่วนลด",
            value: "create",
          },
          {
            label: "ดูรายการส่วนลด",
            value: "view",
          },
          {
            label: "แก้ไขรายการส่วนลด",
            value: "edit",
          },
          {
            label: "ลบรายการส่วนลด",
            value: "delete",
          },
        ],
      },
      {
        label: "จัดการร้านค้า",
        groupNameNested: "oneFinity",
        listNested: [
          {
            label: "สร้างร้านค้า",
            value: "create",
          },
          {
            label: "ดูร้านค้า",
            value: "view",
          },
          {
            label: "แก้ไขร้านค้า",
            value: "edit",
          },
          {
            label: "ลบร้านค้า",
            value: "delete",
          },
        ],
      },
    ],
  },
};

export const mockRoles = [
  {
    menuName: "manageOrder",
    menu: ["view", "edit"],
  },
  {
    menuName: "specialRequest",
    menu: ["view", "approve"],
  },
  {
    menuName: "productList",
    menu: ["view", "edit", "sync"],
  },
  {
    menuName: "priceSpecialExclusive",
    menu: ["view", "create", "edit", "delete"],
  },
  {
    menuName: "promotionSetting",
    menu: ["create", "view", "edit", "delete", "approve", "document"],
  },
  {
    menuName: "freebieList",
    menu: ["view", "edit", "sync"],
  },
  {
    menuName: "discountCo",
    menu: {
      discountList: ["create", "view", "edit", "delete", "approve"],
      manageConditionStore: ["create", "view", "edit", "delete", "approve"],
      manageCondition: ["create", "view", "edit"],
    },
  },
  {
    menuName: "news",
    menu: {
      newsList: ["create", "edit", "delete"],
      pinedNews: ["edit"],
      highlightNews: ["create", "edit", "delete"],
    },
  },
  {
    menuName: "manageUser",
    menu: {
      userList: ["view", "create", "edit"],
      manageRoles: ["view", "create", "edit", "delete"],
    },
  },
  {
    menuName: "manageStore",
    menu: {
      storeList: ["view", "create", "edit", "sync"],
      approvePhone: ["view", "approve"],
      shopGroup: ["view", "create", "edit"],
    },
  },
  {
    menuName: "oneFinity",
    menu: {
      brandSetting: ["view", "create", "edit", "delete"],
      shopSetting: ["view", "create", "edit", "delete"],
    },
  },
];
