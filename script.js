var db = [
    {
        name: "1-А",
        shedule: [
            [ "Математика", "Физ-ра", "Хуета", "Биология" ],
            [ "Русский язык", "Физ-ра", "Хуета", "Литература" ],
            [],
            [ "Математика", "Физ-ра", "Биология", "Труды", "БДСМ", "English" ],
            [],
            []
        ]
    }
];
var currentClass;
const days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"];
const fckngDays = ["Понедельник", "Вторник", "Среду", "Четверг", "Пятницу", "Субботу"];

const openAddClassModal = () => {
    addClassModal.style.display = "flex";
    setTimeout(() => {
        addClassModal.style.backgroundColor = "rgba(0, 0, 0, 0.4)";
        addClassModal.children[0].style.transform = "scale(1)";
    }, 0);
}

const closeAddClassModal = () => {
    addClassModal.children[0].style.transform = "scale(0)";
    addClassModal.style.backgroundColor = "rgba(0, 0, 0, 0)";
    setTimeout(() => {
        addClassModal.style.display = "none";
        addClassModal.querySelector("input").value = "";
    }, 300);
}

const openShedule = () => {
    classesContainer.classList.add("leftPositioned");
    sheduleContainer.classList.add("leftPositioned");
    sheduleContainer.children[0].style.transform = "translateY(0)";
    updateSheduleContainer();
}

const closeShedule = () => {
    classesContainer.classList.remove("leftPositioned");
    sheduleContainer.classList.remove("leftPositioned");
    sheduleContainer.children[0].style.transform = "translateY(-120px)";
    currentClass = null;
}

const createClassItem = (name, isLast, index) => {
    const obj = document.createElement("div");
    obj.innerText = name;
    obj.addEventListener("click", () => {
        if (isLast) {
            openAddClassModal();
        } else {
            sheduleContainer.querySelector("h2").innerText = name;
            currentClass = index;
            openShedule();
        }
    });
    return obj;
}

const createLessonItem = (name, lessonIndex, sheduleIndex) => {
    const obj = document.createElement("div");
    const span = document.createElement("span");
    const renameIcon = document.createElement("img");
    const deleteIcon = document.createElement("img");
    renameIcon.src = "src/edit_icon.svg";
    deleteIcon.src = "src/trash_icon.svg";
    renameIcon.draggable = false;
    deleteIcon.draggable = false;
    span.innerText = name;
    obj.append(span, renameIcon, deleteIcon);
    obj.className = "lessonItem";
    renameIcon.addEventListener("click", () => {
        console.log(lessonIndex, sheduleIndex);
        const name = prompt("Введите новое название");
        if (!name || !name.trim()) return;
        span.innerText = db[currentClass].shedule[sheduleIndex][lessonIndex] = name.trim();
    });
    deleteIcon.addEventListener("click", () => {
        const answer = confirm(`Вы уверены, что хотите удалить урок "${db[currentClass].shedule[sheduleIndex][lessonIndex]}"?`);
        if (!answer) return;
        db[currentClass].shedule[sheduleIndex].splice(lessonIndex, 1);
        obj.style.opacity = 0;
        setTimeout(() => {
            sheduleContainer.children[1].children[sheduleIndex].children[1].replaceChildren(...db[currentClass].shedule[sheduleIndex].map((item, index) => createLessonItem(item, index, sheduleIndex)));
        }, 300);
    });
    return obj;
}

const createSheduleItem = (arr, sheduleIndex) => {
    const obj = document.createElement("div");
    const h3 = document.createElement("h3");
    const header = document.createElement("div");
    const addIcon = document.createElement("img");
    const container = document.createElement("div");
    addIcon.src = "src/add_icon.svg";
    addIcon.addEventListener("click", () => {
        const name = prompt("Введите предмет");
        if (!name || !name.trim()) return;
        db[currentClass].shedule[sheduleIndex].push(name);
        container.append(createLessonItem(name, db[currentClass].shedule[sheduleIndex].length - 1, sheduleIndex));
    });
    h3.innerText = days[sheduleIndex];
    header.append(h3, addIcon);
    container.append(...arr.map((item, index) => createLessonItem(item, index, sheduleIndex)));
    obj.append(header, container);
    return obj;
}

const updateClassesContainer = () => {
    classesContainer.children[0].replaceChildren(...db.map((item, index) => createClassItem(item.name, false, index)), createClassItem("+", true));
}

const updateSheduleContainer = () => {
    const arr = db[currentClass].shedule.map(createSheduleItem);
    sheduleContainer.children[1].replaceChildren(...arr);
    for (let i = 0; i < arr.length; i++) {
        setTimeout(() => {
            arr[i].style.opacity = 1;
        }, i * 100 + 500);
    }
}

addEventListener("load", () => {

    setTimeout(() => {
        //authModal.style.top = "100px";
        //authModal.style.opacity = 1;
    }, 500);

    updateClassesContainer();

    addClassModal.children[0].addEventListener("click", e => e.stopPropagation());

    addClassModal.addEventListener("click", () => {
        closeAddClassModal();
    });

    addClassModal.querySelector("button").addEventListener("click", () => {
        const text = addClassModal.querySelector("input").value;
        if (text) db.push({
            name: text,
            shedule: [
                [], [], [], [], [], []
            ]
        });
        closeAddClassModal();
        updateClassesContainer();
    });

    closeSheduleButton.addEventListener("click", closeShedule);

    deleteClassButton.addEventListener("click", () => {
        const answer = confirm(`Вы уверены, что хотите удалить класс ${db[currentClass].name}?`);
        if (!answer) return;
        db.splice(currentClass, 1);
        updateClassesContainer();
        closeShedule();
    });

    renameClassButton.addEventListener("click", () => {
        const name = prompt("Введите новое название");
        if (!name || !name.trim()) return;
        sheduleContainer.querySelector("h2").innerText = db[currentClass].name = name.trim();
        updateClassesContainer();
    });
});