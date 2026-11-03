const allComments = document.querySelectorAll(".comment");

function revealOnScroll() {
    const trigger = window.innerHeight * 0.9;

    allComments.forEach(comment => {
        const top = comment.getBoundingClientRect().top;

        if (top < trigger) {
            comment.classList.add("show");
        }
    });
}



let singleFaq = {
    question: "Wie oft muss ich meine Pfingstrosen gießen?",
    answer: "Pfingstrosen lieben feuchte Erde, vertragen aber keine Staunässe. Ein- bis zweimal pro Woche gießen reicht meistens völlig aus."
};

console.log("Aufgabe 4.1 - Einzelnes Blumen-Objekt:", singleFaq);


let faqList = [];



// LOAD (Hash → sonst JSON)

function loadFaqsFromHash() {

    fetch("/hash/floraadora/faqs")
        .then(res => res.json())
        .then(data => {

            if (data.faqs && data.faqs.length > 0) {
                faqList = data.faqs;
            } else {
                return loadFaqsFromJson();
            }

            renderAllFaqs();
            revealOnScroll();
        })
        .catch(() => {
            loadFaqsFromJson();
        });
}

function loadFaqsFromJson() {

    fetch("faqs.json")
        .then(res => res.json())
        .then(data => {

            faqList = data;

            renderAllFaqs();
            revealOnScroll();
        })
        .catch(err => {
            console.error("Fehler beim Laden der JSON:", err);
        });
}

function saveFaqsToHash() {

    fetch("/hash/floraadora/faqs", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            faqs: faqList
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Gespeichert:", data);
    })
    .catch(err => {
        console.error("Speicherfehler:", err);
    });
}


function initFaqForm() {

    const form = document.getElementById("new-faq-form");
    if (!form) return;

    form.addEventListener("submit", function(event) {

        event.preventDefault();

        const questionText = document.getElementById("input-question").value;
        const answerText = document.getElementById("input-answer").value;

        faqList.push({
            question: questionText,
            answer: answerText
        });

        renderAllFaqs();
        saveFaqsToHash();

        form.reset();
    });
}


function createFaqElement(faqObjekt) {

    const faqBox = document.createElement("div");
    faqBox.className = "faq-item";

    faqBox.innerHTML = `
        <div class="faq-header" style="cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
            <div>🪽 ${faqObjekt.question}</div>
            <span class="faq-icon">▼</span>
        </div>

        <div class="faq-content" style="max-height:0; overflow:hidden; transition:max-height 0.3s ease;">
            <p style="padding-top:15px;">${faqObjekt.answer}</p>
        </div>
    `;

    const header = faqBox.querySelector(".faq-header");
    const content = faqBox.querySelector(".faq-content");
    const icon = faqBox.querySelector(".faq-icon");

    header.addEventListener("click", function() {

        const open = content.style.maxHeight && content.style.maxHeight !== "0px";

        if (open) {
            content.style.maxHeight = "0px";
            icon.style.transform = "rotate(0deg)";
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
            icon.style.transform = "rotate(180deg)";
        }
    });

    document.getElementById("faq-container").appendChild(faqBox);
}


function renderAllFaqs() {

    const container = document.getElementById("faq-container");
    if (!container) return;

    container.innerHTML = "";

    faqList.forEach(faq => {
        createFaqElement(faq);
    });
}
 
document.addEventListener("DOMContentLoaded", function() {

    loadFaqsFromHash();
    initFaqForm();
    revealOnScroll();
});

window.addEventListener("scroll", revealOnScroll);