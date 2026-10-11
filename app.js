const products = [
{id:1,name:"iPhone XS",category:"iPhone",price:42000,desc:"64GB • Space Gray",icon:"https://drive.google.com/file/d/1KcbPZWHA2Y_7S3Q8hoXqsZJ7ED3GA5C_/view?usp=drivesdk"},
{id:2,name:"iPhone 11",category:"iPhone",price:57000,desc:"128GB • Black",icon:"📱"},
{id:3,name:"iPhone 12",category:"iPhone",price:74000,desc:"128GB • Black",icon:"📱"},
{id:4,name:"iPhone 13",category:"iPhone",price:99000,desc:"128GB • Midnight",icon:"📱"},
{id:5,name:"iPhone 14",category:"iPhone",price:125000,desc:"128GB • Midnight",icon:"📱"},
{id:6,name:"iPhone 15",category:"iPhone",price:165000,desc:"128GB • Black",icon:"📱"},
{id:7,name:"iPhone 16",category:"iPhone",price:220000,desc:"128GB • Black",icon:"📱"},
{id:8,name:"iPhone 17",category:"iPhone",price:285000,desc:"Base model • Estimate",icon:"📱"},
{id:9,name:"MacBook Air M1",category:"MacBook",price:152000,desc:"8GB RAM • 256GB SSD",icon:"💻"},
{id:10,name:"MacBook Air M2",category:"MacBook",price:222000,desc:"8GB RAM • 256GB SSD",icon:"💻"},
{id:11,name:"MacBook Air M3",category:"MacBook",price:282000,desc:"16GB RAM • 256GB SSD",icon:"💻"},
{id:12,name:"MacBook Air M4",category:"MacBook",price:335000,desc:"Base configuration • Estimate",icon:"💻"},
{id:13,name:"MacBook Pro 14-inch",category:"MacBook",price:465000,desc:"Pro series • Configuration varies",icon:"💻"},
{id:14,name:"MacBook Pro 16-inch",category:"MacBook",price:625000,desc:"Pro series • Configuration varies",icon:"💻"},
{id:15,name:"Apple Watch SE",category:"Watch",price:72000,desc:"Smartwatch • GPS",icon:"⌚"},
{id:16,name:"Apple Watch Series 9",category:"Watch",price:98000,desc:"Smartwatch • GPS",icon:"⌚"},
{id:17,name:"Apple Watch Series 10",category:"Watch",price:125000,desc:"Smartwatch • GPS",icon:"⌚"},
{id:18,name:"Apple Watch Ultra 2",category:"Watch",price:220000,desc:"Rugged smartwatch",icon:"⌚"},
{id:19,name:"Classic Steel Watch",category:"Watch",price:8500,desc:"Stainless-steel style",icon:"⌚"},
{id:20,name:"Minimal Black Watch",category:"Watch",price:6500,desc:"Everyday style",icon:"⌚"}
];
let activeCategory="All", cart=JSON.parse(localStorage.getItem("luxora-cart")||"[]");
const money=n=>"Rs. "+Number(n).toLocaleString("en-PK");
const grid=document.getElementById("productGrid");
function renderProducts(){const q=document.getElementById("search").value.toLowerCase();const shown=products.filter(p=>(activeCategory==="All"||p.category===activeCategory)&&(p.name+" "+p.desc+" "+p.category).toLowerCase().includes(q));grid.innerHTML=shown.map(p=>`<article class="product-card"><div class="product-image"><div class="fallback-art">${p.icon}</div></div><div class="product-info"><div class="category">${p.category}</div><h3>${p.name}</h3><div class="desc">${p.desc}</div><div class="price">${money(p.price)}</div><button class="add-btn" onclick="addToCart(${p.id})">＋ Add to cart</button></div></article>`).join("")||"<p>No products found.</p>";}
function save(){localStorage.setItem("luxora-cart",JSON.stringify(cart));renderCart();}
function addToCart(id){const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});save();openCart();}
function changeQty(id,delta){const item=cart.find(x=>x.id===id);if(item)item.qty+=delta;cart=cart.filter(x=>x.qty>0);save();}
function removeItem(id){cart=cart.filter(x=>x.id!==id);save();}
function renderCart(){document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);const el=document.getElementById("cartItems");el.innerHTML=cart.length?cart.map(x=>{const p=products.find(y=>y.id===x.id);return `<div class="cart-row"><div class="cart-thumb">${p.icon}</div><div><h4>${p.name}</h4><small>${money(p.price)} each</small><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button><span>${x.qty}</span><button onclick="changeQty(${p.id},1)">+</button></div></div><button class="remove" onclick="removeItem(${p.id})">Remove</button></div>`}).join(""):'<p class="small">Your cart is empty. Add a product to get started.</p>';const total=cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0);document.getElementById("cartSubtotal").textContent=money(total);renderCheckoutSummary();}
function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("overlay").classList.add("show");}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("overlay").classList.remove("show");}
function renderCheckoutSummary(){const list=document.getElementById("checkoutItems");if(!list)return;list.innerHTML=cart.map(x=>{const p=products.find(y=>y.id===x.id);return `<div class="order-line"><span>${p.name} × ${x.qty}</span><b>${money(p.price*x.qty)}</b></div>`}).join("")||'<p class="small">No products selected.</p>';document.getElementById("checkoutTotal").textContent=money(cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0));}
document.querySelectorAll(".filter").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));b.classList.add("active");activeCategory=b.dataset.category;renderProducts();}));
document.getElementById("search").addEventListener("input",renderProducts);
document.getElementById("openCart").addEventListener("click",openCart);document.getElementById("closeCart").addEventListener("click",closeCart);document.getElementById("overlay").addEventListener("click",closeCart);
document.getElementById("checkoutBtn").addEventListener("click",()=>{if(!cart.length){alert("Please add a product to your cart first.");return;}closeCart();document.getElementById("products").style.display="none";document.getElementById("about").style.display="none";document.querySelector(".hero").style.display="none";document.querySelector(".trust-strip").style.display="none";document.getElementById("checkoutPage").classList.add("active");renderCheckoutSummary();window.scrollTo(0,0);});
document.getElementById("backToShop").addEventListener("click",()=>{document.getElementById("checkoutPage").classList.remove("active");document.getElementById("products").style.display="block";document.getElementById("about").style.display="block";document.querySelector(".hero").style.display="grid";document.querySelector(".trust-strip").style.display="flex";window.scrollTo(0,0);});
document.getElementById("checkoutForm").addEventListener("submit",async e=>{e.preventDefault();if(!cart.length)return;const data=new FormData(e.target);const payload={customer:data.get("customer"),phone:data.get("phone"),address:data.get("address"),payment:data.get("payment"),items:cart.map(x=>({productId:x.id,quantity:x.qty})),instagram:"whose._.safi"};const btn=e.target.querySelector('button[type="submit"]');btn.disabled=true;btn.textContent="Sending order…";try{const response=await fetch("/api/orders",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});const result=await response.json();if(!response.ok)throw new Error(result.error||"Order could not be saved");document.getElementById("successText").textContent=`Thank you, ${payload.customer}. Order ${result.orderId} has been saved on the store server. Payment method: ${payload.payment}. The seller still needs to confirm availability and payment details.`;document.getElementById("successModal").classList.add("show");}catch(err){document.getElementById("successText").textContent="Could not reach the store backend. Please make sure the website is running through the Node.js server, not by opening index.html directly. "+err.message;document.getElementById("successModal").classList.add("show");}finally{btn.disabled=false;btn.textContent="Place order";}});
document.getElementById("finishOrder").addEventListener("click",()=>{document.getElementById("successModal").classList.remove("show");cart=[];save();document.getElementById("checkoutPage").classList.remove("active");document.getElementById("products").style.display="block";document.getElementById("about").style.display="block";document.querySelector(".hero").style.display="grid";document.querySelector(".trust-strip").style.display="flex";window.scrollTo(0,0);});
renderProducts();renderCart();
