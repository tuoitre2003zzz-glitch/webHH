const assert = require("node:assert/strict");
const { test } = require("node:test");

const {
    buildConstructionDisplaySchedule,
    getConstructionStepLabel
} = require("./construction-simulation.js");

const tieBeamKeys = [
    "Đào rãnh + lót giằng",
    "Cốp pha giằng",
    "Thép giằng móng",
    "Đổ BT giằng móng"
];

function createSteps() {
    const keys = [
        "Định vị",
        "Ép cọc",
        "Đào móng",
        "BT lót hố",
        "Cốt thép móng",
        "Cốp pha móng",
        "Đổ BT móng",
        "Lấp đất hố móng",
        ...tieBeamKeys,
        "Lấp rãnh, cát nền",
        "Ống âm nền",
        "Đổ BT cột trệt",
        "Xây tường trệt",
        "Cốp pha + thép dầm sàn L1",
        "Thép dầm sàn L1",
        "Đổ BT dầm sàn L1",
        "Cột lầu 1",
        "Xây tường L1",
        "Cột mái + sườn thép mái",
        "Chống thấm"
    ];

    return keys.map((key) => [
        key,
        key,
        "Tiêu chuẩn",
        ({
            "Đào móng": ["Đào quanh cọc bằng thủ công."],
            "BT lót hố": ["Đập bỏ phần đầu cọc đến sát lớp bê tông lót."],
            "Đổ BT cột trệt": [
                "Vệ sinh chân cột, xử lý kết nối bê tông cũ và mới bằng hồ dầu.",
                "Bê tông M250 R28 (cần thì dùng R14 và phụ gia chống thấm B8), độ sụt 12±2."
            ],
            "Xây tường trệt": [
                "Khu vực WC, ban công, sân thượng xây 3 hàng gạch thẻ.",
                "Mạch vữa ngang khoảng 12 mm, mạch đứng khoảng 10 mm (trong khoảng 8–15 mm), no vữa; xây đến dầm thì khóa đỉnh tường bằng 3 hàng gạch thẻ."
            ],
            "Cột lầu 1": ["Đổ bê tông từng đoạn, xử lý hồ dầu chân cột, không đổ từ trên cao."],
            "Xây tường L1": ["Thực hiện như tầng trệt: định vị, tưới ẩm, hồ dầu, thép râu, lanh tô, khóa đỉnh tường."],
            "Cột mái + sườn thép mái": [
                "Đổ bê tông, đầm dùi kỹ, xử lý mạch ngừng chân cột bằng hồ dầu.",
                "Chia cột mái thành 5 hàng. Chừa bản mã hoặc bu lông chờ để liên kết sườn thép mái.",
                "Gia công kèo, xà gồ thép mạ kẽm theo bản vẽ.",
                "Dựng kèo thép lên đỉnh cột bê tông, liên kết bản mã bằng bu lông hoặc hàn.",
                "Lắp xà gồ đúng bước, đúng độ dốc mái.",
                "Lắp hệ litô theo bước ngói."
            ],
            "Chống thấm": ["Đạt mới được dựng sườn thép và lợp mái."]
        })[key] || [],
        ({
            "Chống thấm": ["Biên bản ngâm nước trước khi dựng sườn thép mái."]
        })[key] || []
    ]);
}

test("non-pile foundations omit pile work and map excavation to its raw step", () => {
    const sourceSteps = createSteps();
    const schedule = buildConstructionDisplaySchedule(sourceSteps, "isolated");
    const displayedKeys = schedule.displaySteps.map((step) => step[1]);
    const excavationDisplayIndex = displayedKeys.indexOf("Đào móng");
    const blindingStep = schedule.displaySteps.find((step) => step[1] === "BT lót hố");

    assert.equal(displayedKeys.includes("Ép cọc"), false);
    assert.deepEqual(schedule.simulationStepIndexes[excavationDisplayIndex], [2]);
    assert.equal(blindingStep[0].includes("đầu cọc"), false);
    assert.equal(blindingStep[3].some((item) => item.includes("cọc")), false);
    assert.equal(sourceSteps[3][3][0], "Đập bỏ phần đầu cọc đến sát lớp bê tông lót.");
});

test("pile foundations retain the pile stage and correct head elevation instruction", () => {
    const schedule = buildConstructionDisplaySchedule(createSteps(), "pile");
    const displayedKeys = schedule.displaySteps.map((step) => step[1]);
    const blindingStep = schedule.displaySteps.find((step) => step[1] === "BT lót hố");
    const pileHeadInstruction = blindingStep[3][0];

    assert.equal(displayedKeys.includes("Ép cọc"), true);
    assert.match(pileHeadInstruction, /100–150 mm/);
    assert.match(pileHeadInstruction, /cao hơn mặt bê tông lót/i);
    assert.match(pileHeadInstruction, /không đục sát/i);
});

test("tie-beam display maps to its four raw animation steps after filtering", () => {
    const schedule = buildConstructionDisplaySchedule(createSteps(), "strip");
    const tieBeamDisplayIndex = schedule.displaySteps.findIndex((step) => step[1] === "Thi công giằng móng");
    const tieStart = createSteps().findIndex((step) => step[1] === tieBeamKeys[0]);
    const afterTieBeamDisplayIndex = tieBeamDisplayIndex + 1;

    assert.deepEqual(
        schedule.simulationStepIndexes[tieBeamDisplayIndex],
        [tieStart, tieStart + 1, tieStart + 2, tieStart + 3]
    );
    assert.deepEqual(schedule.simulationStepIndexes[afterTieBeamDisplayIndex], [tieStart + 4]);
});

test("column concrete uses cement slurry at the joint and excludes waterproof admixture", () => {
    const steps = buildConstructionDisplaySchedule(createSteps(), "isolated").displaySteps;
    const columnSteps = steps.filter((step) => [
        "Đổ BT cột trệt",
        "Cột lầu 1",
        "Cột mái + sườn thép mái"
    ].includes(step[1]));
    const columnInstructions = columnSteps.flatMap((step) => step[3]).join(" ");

    assert.equal(columnSteps.length, 3);
    assert.match(columnInstructions, /hồ dầu \(nước xi măng\)/i);
    assert.match(columnInstructions, /không dùng phụ gia chống thấm/i);
    assert.match(columnInstructions, /M250 R28/);
    assert.match(columnInstructions, /không đổ từ trên cao/i);
    assert.match(columnInstructions, /đầm dùi kỹ/i);
    assert.doesNotMatch(columnInstructions, /B8|phụ gia chống thấm B8/i);
});

test("wall built before beam or slab uses sloped brick wedges at the top", () => {
    const steps = buildConstructionDisplaySchedule(createSteps(), "isolated").displaySteps;
    const groundWall = steps.find((step) => step[1] === "Xây tường trệt");
    const upperWall = steps.find((step) => step[1] === "Xây tường L1");
    const wallInstructions = [...groundWall[3], ...upperWall[3]].join(" ");

    assert.match(wallInstructions, /xây tường trước khi đổ bê tông dầm sàn lầu hoặc mái/i);
    assert.match(wallInstructions, /gạch thẻ xây xéo/i);
    assert.doesNotMatch(wallInstructions, /khóa đỉnh tường bằng 3 hàng gạch thẻ/i);
    assert.match(wallInstructions, /khu vực WC.*3 hàng gạch thẻ/i);
    assert.match(wallInstructions, /mạch vữa ngang khoảng 12 mm.*mạch đứng khoảng 10 mm.*no vữa/i);
});

test("upper-storey headings identify the level as floor 2 or first upper floor", () => {
    const steps = buildConstructionDisplaySchedule(createSteps(), "isolated").displaySteps;
    const upperColumn = steps.find((step) => step[1] === "Cột lầu 1");
    const upperFloorLabels = [
        ["Cốp pha + thép dầm sàn L1", "Cốp pha dầm sàn tầng 2 (lầu 1)"],
        ["Thép dầm sàn L1", "Thép dầm sàn tầng 2 (lầu 1)"],
        ["Đổ BT dầm sàn L1", "Bê tông dầm sàn tầng 2 (lầu 1)"],
        ["Cột lầu 1", "Cột tầng 2 (lầu 1)"],
        ["Xây tường L1", "Tường tầng 2 (lầu 1)"]
    ];

    assert.match(upperColumn[0], /tầng 2 \(lầu 1\)/i);
    assert.match(upperColumn[3].join(" "), /theo hồ sơ thiết kế/i);
    assert.equal(getConstructionStepLabel("Cột lầu 1"), "Cột tầng 2 (lầu 1)");
    assert.match(upperColumn[3].join(" "), /tầng 2 ở miền Bắc.*lầu 1 ở miền Nam/i);
    for (const [stepKey, label] of upperFloorLabels) {
        const step = steps.find((entry) => entry[1] === stepKey);
        assert.ok(step, `Missing upper-floor step: ${stepKey}`);
        assert.match(step[0], /tầng 2 \(lầu 1\)/i);
        assert.equal(getConstructionStepLabel(stepKey), label);
    }
});

test("residential roof framing uses box-steel trusses and avoids default plate-bolt details", () => {
    const steps = buildConstructionDisplaySchedule(createSteps(), "isolated").displaySteps;
    const roofFrame = steps.find((step) => step[1] === "Cột mái + sườn thép mái");
    const waterproofing = steps.find((step) => step[1] === "Chống thấm");
    const roofInstructions = roofFrame[3].join(" ");
    const waterproofingQuality = waterproofing[4].join(" ");

    assert.match(roofFrame[0], /kèo, xà gồ thép hộp/i);
    assert.doesNotMatch(roofFrame[0], /sườn thép/i);
    assert.match(roofInstructions, /mái ngói hoặc tole/i);
    assert.match(roofInstructions, /kèo.*xà gồ.*thép hộp/i);
    assert.match(roofInstructions, /theo hồ sơ thiết kế/i);
    assert.doesNotMatch(roofInstructions, /bản mã|bu lông/i);
    assert.match(waterproofing[3].join(" "), /hệ kèo, xà gồ thép hộp/i);
    assert.match(waterproofingQuality, /kèo, xà gồ thép hộp/i);
    assert.doesNotMatch(waterproofingQuality, /sườn thép mái/i);
    assert.equal(getConstructionStepLabel("Cột mái + sườn thép mái"), "Kèo, xà gồ thép mái");
});
