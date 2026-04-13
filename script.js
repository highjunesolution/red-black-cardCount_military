const myModal = new bootstrap.Modal(document.getElementById("modal"));

const red = document.getElementById("red");
const black = document.getElementById("black");
const list = document.getElementById("list");
const listData = [];
let redCount;
let blackCount;

const redBtn = document.getElementById("redBtn");
const blackBtn = document.getElementById("blackBtn");
const resetBtn = document.getElementById("resetBtn")
const closeModalBtn = document.getElementById("closeModalBtn")

document.addEventListener("DOMContentLoaded", () => {
    const savedRed = localStorage.getItem("redCount");
    const savedBlack = localStorage.getItem("blackCount"); // ✅ แก้: เคยโหลดจาก "redCount"
    const savedList = localStorage.getItem("listData");
    const savedTotal = localStorage.getItem("totalCard")

    if (savedRed > 0 && savedBlack > 0) {
        redCount = parseInt(savedRed);
        blackCount = parseInt(savedBlack);

        // ✅ แก้: ป้องกัน push null เข้า array
        if (savedList) {
            const parsed = JSON.parse(savedList);
            if (Array.isArray(parsed)) {
                listData.push(...parsed);
            }
        }

        document.getElementById("totalCount").innerText = ` ${savedTotal} ใบ`;
        document.getElementById("right").classList.remove("d-none");
        document.getElementById("left").classList.add("col-md-8", "col-xl-10");
        red.innerText = redCount;
        black.innerText = blackCount;

        // ✅ แก้: disable ปุ่มถ้านับหมดแล้ว
        if (redCount === 0) redBtn.disabled = true;
        if (blackCount === 0) blackBtn.disabled = true;

        updatePercent();
        showList();
        return;
    }

    myModal.show();
});

document.getElementById("saveBtn").addEventListener("click", () => {
    redCount = parseInt(document.getElementById("redInput").value);
    blackCount = parseInt(document.getElementById("blackInput").value);

    redBtn.disabled = false
    blackBtn.disabled = false

    listData.splice(0, listData.length)
    if (!redCount || !blackCount || redCount < 0 || blackCount < 0) {
        return alert("โปรดระบุ จำนวนใบดำใบแดงให้ถูกต้องครบถ้วน");
    }

    localStorage.setItem("redCount", redCount);
    localStorage.setItem("blackCount", blackCount); // ✅ แก้: บันทึกให้ถูก key
    localStorage.setItem("totalCard", redCount + blackCount)
    document.getElementById("totalCount").innerText = ` ${redCount + blackCount} ใบ`;
    myModal.hide();
    document.getElementById("right").classList.remove("d-none");
    document.getElementById("left").classList.add("col-md-8", "col-xl-10");

    list.innerHTML = ""
    red.innerText = redCount;
    black.innerText = blackCount;
    updatePercent();
});

redBtn.addEventListener("click", () => {
    redCount--;
    if (redCount === 0) redBtn.disabled = true;
    red.innerText = redCount;
    localStorage.setItem("redCount", redCount); // ✅ อัปเดต localStorage ทุกครั้งที่กด

    listData.push({
        card: "🔴",
        time: new Date().toLocaleTimeString('th-TH', {
            hour: '2-digit', minute: "2-digit", second: "2-digit", hour12: false
        })
    });
    localStorage.setItem("listData", JSON.stringify(listData));
    showList();
    updatePercent();
});

blackBtn.addEventListener("click", () => {
    blackCount--;
    if (blackCount === 0) blackBtn.disabled = true;
    black.innerText = blackCount;
    localStorage.setItem("blackCount", blackCount); // ✅ อัปเดต localStorage ทุกครั้งที่กด

    listData.push({
        card: "⚫",
        time: new Date().toLocaleTimeString('th-TH', {
            hour: '2-digit', minute: "2-digit", second: "2-digit", hour12: false
        })
    });
    localStorage.setItem("listData", JSON.stringify(listData));
    showList();
    updatePercent();
});

function updatePercent() {
    const total = redCount + blackCount;
    if (total === 0) return;

    const redPercent = ((redCount / total) * 100).toFixed(2);
    const blackPercent = ((blackCount / total) * 100).toFixed(2);

    document.getElementById("redPercent").innerText = redPercent + "%";
    document.getElementById("blackPercent").innerText = blackPercent + "%";
}

function showList() {
    list.innerHTML = [...listData]
        .map((item, index) => ({ item, index }))
        .reverse()
        .map(({ item, index }) =>
            `<div class="d-flex align-items-center bg-light shadow rounded p-2 mb-2 gap-2">
                <p class="m-0">${index + 1}</p>
                <p class="m-0 me-auto">${item.card}</p>
                <p class="m-0">${item.time}</p>
                <button data-index="${index}" data-card="${item.card}" class="btn btn-danger btn-sm removeBtn">ลบ</button>
            </div>`
        ).join("");
}

list.addEventListener("click", (e) => {
    if (e.target.classList.contains("removeBtn")) {
        const index = parseInt(e.target.dataset.index); // ✅ แก้: แปลงเป็น number
        const card = e.target.dataset.card;

        if (card === "🔴") {
            redCount++;
            redBtn.disabled = false;
            red.innerText = redCount;
            localStorage.setItem("redCount", redCount);
        } else {
            blackCount++;
            blackBtn.disabled = false;
            black.innerText = blackCount;
            localStorage.setItem("blackCount", blackCount);
        }

        listData.splice(index, 1);
        localStorage.setItem("listData", JSON.stringify(listData));
        updatePercent();
        showList();
    }
});

resetBtn.addEventListener("click", () => {
    myModal.show()
    closeModalBtn.hidden = false
})

closeModalBtn.addEventListener("click", () => {
    myModal.hide()
    closeModalBtn.hidden = true
})