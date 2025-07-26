<template>
  <div class="donate-container">
    <div class="hero">
      <div class="hero-content">
        <h1>Support New Immigrants</h1>
        <p>Your donation helps provide essential services to immigrants starting their new lives in Australia</p>
      </div>
      <div class="hero-image">
        <div class="community-icon">👥</div>
        <div class="heart-icon">❤️</div>
        <div class="house-icon">🏠</div>
        <div class="world-icon">🌏</div>
      </div>
    </div>

    <div class="donate-card">
      <div class="donation-options">
        <h2>Make a Donation</h2>
        <p>Choose how you'd like to support</p>
        
        <div class="donation-type">
          <button 
            :class="{ 'active': donationType === 'one-time' }"
            @click="donationType = 'one-time'"
          >
            One-Time Donation
          </button>
          <button 
            :class="{ 'active': donationType === 'monthly' }"
            @click="donationType = 'monthly'"
          >
            Monthly Donation
          </button>
        </div>
      </div>

      <div class="amount-selector">
        <h3>Select Amount (AUD)</h3>
        
        <div class="preset-amounts">
          <button 
            v-for="amount in presetAmounts" 
            :key="amount"
            :class="{ 'selected': selectedAmount === amount && !isCustomAmount }"
            @click="selectAmount(amount)"
          >
            ${{ amount }}
          </button>
        </div>
        
        <div class="custom-amount">
          <button 
            :class="{ 'selected': isCustomAmount }"
            @click="activateCustomAmount"
          >
            Other Amount
          </button>
          <input 
            v-if="isCustomAmount"
            type="number" 
            v-model="customAmount"
            placeholder="Enter amount"
            min="1"
            step="1"
            @input="validateCustomAmount"
          >
        </div>
      </div>
      
      <div class="donation-summary">
        <h3>Your Donation Summary</h3>
        <div class="summary-content">
          <p>
            <span class="summary-label">Donation Type:</span>
            <span class="summary-value">{{ donationType === 'one-time' ? 'One-Time' : 'Monthly' }}</span>
          </p>
          <p>
            <span class="summary-label">Amount:</span>
            <span class="summary-value">${{ donationValue }} AUD</span>
          </p>
        </div>
      </div>
      
      <button 
        class="donate-button"
        :disabled="donationValue <= 0"
        @click="processDonation"
      >
        {{ donationButtonText }}
      </button>
      
      <div class="payment-security">
        <div class="lock-icon">🔒</div>
        <p>Secure payment processing. All transactions are encrypted.</p>
      </div>
    </div>
    
    <div class="impact-section">
      <h2>Your Impact</h2>
      <div class="impact-cards">
        <div class="impact-card">
          <div class="icon">📚</div>
          <h3>Education Support</h3>
          <p>$50 provides language learning materials for one month</p>
        </div>
        <div class="impact-card">
          <div class="icon">⚖️</div>
          <h3>Legal Assistance</h3>
          <p>$100 helps provide legal consultation services</p>
        </div>
        <div class="impact-card">
          <div class="icon">💼</div>
          <h3>Career Support</h3>
          <p>$200 funds a professional certification preparation course</p>
        </div>
      </div>
    </div>
    
    <div class="trust-section">
      <h2>Trusted & Transparent</h2>
      <div class="trust-items">
        <div class="trust-item">
          <div class="icon">🔍</div>
          <p>Annual financial reports available</p>
        </div>
        <div class="trust-item">
          <div class="icon">💯</div>
          <p>90% of donations go directly to programs</p>
        </div>
        <div class="trust-item">
          <div class="icon">🏆</div>
          <p>Registered charity since 2010</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DonatePage',
  data() {
    return {
      donationType: 'one-time', // 'one-time' or 'monthly'
      presetAmounts: [20, 50, 100, 200],
      selectedAmount: 50,
      isCustomAmount: false,
      customAmount: null
    }
  },
  computed: {
    donationValue() {
      if (this.isCustomAmount && this.customAmount > 0) {
        return this.customAmount;
      }
      return this.selectedAmount;
    },
    donationButtonText() {
      const prefix = this.donationType === 'one-time' ? 'Donate' : 'Donate Monthly';
      return `${prefix} $${this.donationValue}`;     }   },   methods: {     selectAmount(amount) {       this.selectedAmount = amount;       this.isCustomAmount = false;       this.customAmount = null;     },     activateCustomAmount() {       this.isCustomAmount = true;       if (!this.customAmount) {         this.customAmount = 50; // Default value       }     },     validateCustomAmount() {       if (this.customAmount < 1) {         this.customAmount = 1;       }     },     processDonation() {       // In a real app, this would connect to a payment gateway       if (this.donationType === 'one-time') {         alert(`Thank you for your donation of $${this.donationValue} AUD!`);
      } else {
        alert(`Thank you for setting up a monthly donation of $${this.donationValue} AUD!`);
      }
      
      // Reset the form
      this.selectedAmount = 50;
      this.isCustomAmount = false;
      this.customAmount = null;
    }
  }
}
</script>

<style scoped>
.donate-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #2c3e50;
}

.hero {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 40px;
  margin-bottom: 40px;
  background: linear-gradient(135deg, #3498db 0%, #2c3e50 100%);
  padding: 50px 40px;
  border-radius: 16px;
  color: white;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

.hero-content {
  flex: 1;
  min-width: 300px;
}

.hero h1 {
  font-size: 2.8rem;
  margin-bottom: 15px;
  font-weight: 700;
}

.hero p {
  font-size: 1.3rem;
  opacity: 0.9;
  max-width: 600px;
  line-height: 1.6;
}

.hero-image {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 300px;
  position: relative;
  height: 200px;
}

.hero-image > div {
  position: absolute;
  font-size: 4rem;
  opacity: 0.8;
}

.community-icon {
  top: 5px;
  left: 30%;
}

.heart-icon {
  top: 40px;
  right: 30%;
  font-size: 5rem !important;
  animation: pulse 2s infinite;
}

.house-icon {
  bottom: 20px;
  left: 25%;
}

.world-icon {
  bottom: 30px;
  right: 15%;
}

.donate-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  padding: 40px;
  margin-bottom: 50px;
}

.donation-options {
  text-align: center;
  margin-bottom: 30px;
}

.donation-options h2 {
  font-size: 2.2rem;
  margin-bottom: 10px;
  color: #2c3e50;
}

.donation-options p {
  color: #7f8c8d;
  margin-bottom: 25px;
  font-size: 1.1rem;
}

.donation-type {
  display: flex;
  max-width: 500px;
  margin: 0 auto;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e1e8ed;
}

.donation-type button {
  flex: 1;
  padding: 16px 10px;
  background: #f8f9fa;
  border: none;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.3s ease;
}

.donation-type button.active {
  background: #3498db;
  color: white;
}

.donation-type button:first-child {
  border-right: 1px solid #e1e8ed;
}

.amount-selector {
  margin-bottom: 30px;
}

.amount-selector h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 1.4rem;
}

.preset-amounts {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
}

.preset-amounts button {
  padding: 16px 10px;
  background: #f8f9fa;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 1.1rem;
  transition: all 0.2s ease;
}

.preset-amounts button:hover {
  border-color: #3498db;
  background: #e3f2fd;
}

.preset-amounts button.selected {
  background: #3498db;
  color: white;
  border-color: #3498db;
}

.custom-amount {
  display: flex;
  max-width: 500px;
  margin: 0 auto;
}

.custom-amount button {
  flex-shrink: 0;
  padding: 16px 20px;
  background: #f8f9fa;
  border: 1px solid #e1e8ed;
  border-right: none;
  border-radius: 8px 0 0 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s ease;
}

.custom-amount button:hover {
  border-color: #3498db;
}

.custom-amount button.selected {
  background: #e3f2fd;
  border-color: #3498db;
  color: #3498db;
}

.custom-amount input {
  flex: 1;
  padding: 16px 20px;
  border: 1px solid #e1e8ed;
  border-radius: 0 8px 8px 0;
  font-size: 1.1rem;
  min-width: 0;
}

.custom-amount input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

.donation-summary {
  background: #f1f9ff;
  border-radius: 12px;
  padding: 25px;
  margin: 25px 0;
  border: 1px solid #d1e9ff;
}

.donation-summary h3 {
  text-align: center;
  margin-top: 0;
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 1.4rem;
}

.summary-content {
  max-width: 300px;
  margin: 0 auto;
}

.summary-content p {
  display: flex;
  justify-content: space-between;
  margin: 15px 0;
  font-size: 1.1rem;
}

.summary-label {
  font-weight: 600;
  color: #7f8c8d;
}

.summary-value {
  font-weight: 600;
  color: #3498db;
}

.donate-button {
  display: block;
  width: 100%;
  max-width: 400px;
  margin: 30px auto;
  padding: 18px;
  background: #27ae60;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.3rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(39, 174, 96, 0.2);
}

.donate-button:hover {
  background: #219653;
  transform: translateY(-2px);
  box-shadow: 0 6px 8px rgba(39, 174, 96, 0.3);
}

.donate-button:active {
  transform: translateY(0);
}

.donate-button:disabled {
  background: #95a5a6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.payment-security {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #7f8c8d;
  font-size: 0.95rem;
  margin-top: 20px;
}

.lock-icon {
  font-size: 1.4rem;
}

.impact-section {
  margin: 60px 0;
}

.impact-section h2 {
  text-align: center;
  margin-bottom: 40px;
  font-size: 2.2rem;
  color: #2c3e50;
}

.impact-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.impact-card {
  background: white;
  border-radius: 12px;
  padding: 30px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #eef5fd;
}

.impact-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.impact-card .icon {
  font-size: 3.5rem;
  margin-bottom: 20px;
}

.impact-card h3 {
  color: #3498db;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.impact-card p {
  color: #7f8c8d;
  line-height: 1.6;
  margin: 0;
}

.trust-section {
  background: linear-gradient(135deg, #f1f9ff 0%, #e3f2fd 100%);
  border-radius: 16px;
  padding: 50px 30px;
  margin: 40px 0;
  text-align: center;
}

.trust-section h2 {
  margin-top: 0;
  margin-bottom: 40px;
  font-size: 2.2rem;
  color: #2c3e50;
}

.trust-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  max-width: 1000px;
  margin: 0 auto;
}

.trust-item {
  background: white;
  padding: 30px 20px;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.03);
}

.trust-item .icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: #3498db;
}

.trust-item p {
  font-size: 1.1rem;
  color: #2c3e50;
  line-height: 1.6;
  margin: 0;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@media (max-width: 768px) {
  .hero {
    padding: 30px 20px;
    text-align: center;
  }
  
  .hero-content {
    text-align: center;
    margin: 0 auto;
  }
  
  .donate-card {
    padding: 25px;
  }
  
  .preset-amounts {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .donation-type {
    flex-direction: column;
  }
  
  .donation-type button:first-child {
    border-right: none;
    border-bottom: 1px solid #e1e8ed;
  }
  
  .custom-amount {
    flex-direction: column;
  }
  
  .custom-amount button {
    border-radius: 8px 8px 0 0;
    border-right: 1px solid #e1e8ed;
    border-bottom: none;
    width: 100%;
  }
  
  .custom-amount input {
    border-radius: 0 0 8px 8px;
    width: 100%;
  }
}
</style>