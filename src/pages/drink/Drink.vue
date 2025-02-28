<template>
	<view class="container" v-if="!loading">
		<view class="main" v-if="goods.length">
			<view class="nav">
				<view class="header">
					<view class="left" v-if="orderType === 'takein'">
						<view class="store-name">
							<text>{{ store.name }}</text>
							<view class="iconfont iconarrow-right"></view>
						</view>
						<view class="store-location">
							<image src='/static/images/order/location.png' style="width: 30rpx; height: 30rpx;" class="mr-10"></image>
							<text>距离您 {{ store.distance_text }}</text>
						</view>
					</view>
					<view class="left overflow-hidden" v-else>
						<view class="d-flex align-items-center overflow-hidden">
							<image src='/static/images/order/location.png' style="width: 30rpx; height: 30rpx;" class="mr-10"></image>
							<view class="font-size-extra-lg text-color-base font-weight-bold text-truncate">
								{{ address.street }}
							</view>
						</view>
						<view class="font-size-sm text-color-assist overflow-hidden text-truncate">
							由<text class="text-color-base" style="margin: 0 10rpx">{{ store.name }}</text>配送
						</view>
					</view>
					<view class="right">
						<view class="dinein" :class="{active: orderType === 'takein'}" @tap="handleOrderTypeChange('takein')">
							<text>自取</text>
						</view>
						<view class="takeout" :class="{active: orderType === 'takeout'}" @tap="handleTakeout">
							<text>外卖</text>
						</view>
					</view>
				</view>
				<view class="coupon">
					<text class="title">"霸气mini卡"超级购券活动，赶紧去购买</text>
					<view class="iconfont iconarrow-right"></view>
				</view>
			</view>
			<view class="content">
				<scroll-view class="menus" :scroll-into-view="menuScrollIntoView" scroll-with-animation scroll-y>
					<view class="wrapper">
						<view class="menu" :id="`menu-${item.id}`" :class="{'current': item.id === currentCateId}" 
							v-for="(item, index) in goods" :key="index" @tap="handleMenuTap(item.id)">
							<text>{{ item.name }}</text>
							<view class="dot" v-show="menuCartNum(item.id)">{{ menuCartNum(item.id) }}</view>
						</view>
					</view>
				</scroll-view>
				<scroll-view class="goods" scroll-with-animation scroll-y :scroll-top="cateScrollTop" @scroll="handleGoodsScroll">
					<view class="wrapper">
						<swiper class="ads" id="ads" :autoplay="true" :interval="3000" :indicator-dots="true">
							<swiper-item v-for="(item, index) in ads" :key='index'>
								<image :src="item.image"></image>
							</swiper-item>
						</swiper>
						<view class="list">
							<view class="category" v-for="(item, index) in goods" :key="index" :id="`cate-${item.id}`">
								<view class="title">
									<text>{{ item.name }}</text>
									<image :src="item.icon" class="icon"></image>
								</view>
								<view class="items">
									<view class="good" v-for="(good, key) in item.goods_list" :key="key">
										<image :src="good.images" class="image" @tap="showGoodDetailModal(item, good)"></image>
										<view class="right">
											<text class="name">{{ good.name }}</text>
											<text class="tips">{{ good.content }}</text>
											<view class="price_and_action">
												<text class="price">￥{{ good.price }}</text>
												<view class="btn-group" v-if="good.use_property">
													<button type="primary" class="btn property_btn" hover-class="none"
													 size="mini" @tap="showGoodDetailModal(item, good)">
														选规格
													</button>
													<view class="dot" v-show="goodCartNum(good.id)">{{ goodCartNum(good.id) }}</view>
												</view>
												<view class="btn-group" v-else>
													<button type="default" v-show="goodCartNum(good.id)" plain class="btn reduce_btn"
													 size="mini" hover-class="none" @tap="handleReduceFromCart(item, good)">
														<view class="iconfont iconsami-select"></view>
													</button>
													<view class="number" v-show="goodCartNum(good.id)">{{ goodCartNum(good.id) }}</view>
													<button type="primary" class="btn add_btn" size="min" hover-class="none" 
														@tap="handleAddToCart(item, good, 1)">
														<view class="iconfont iconadd-select"></view>
													</button>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
			<view class="cart-box" v-if="cartList.length > 0">
				<view class="mark">
					<image src="/static/images/menu/cart.png" class="cart-img" @tap="openCartPopup"></image>
					<view class="tag">{{ cartCount }}</view>
				</view>
				<view class="price">￥{{ cartTotal }}</view>
				<button type="primary" class="pay-btn" @tap="handleToPay" :disabled="isPayDisabled">
					{{ isPayDisabled ? `差${deliverySpread}元起送` : '去结算' }}
				</button>
			</view>
		</view>
		<modal :show="goodDetailModalVisible" class="good-detail-modal" color="#5A5B5C" 
				width="90%" custom padding="0rpx" radius="12rpx">
			<view class="cover">
				<image v-if="selectedGood.images" :src="selectedGood.images" class="image"></image>
				<view class="btn-group">
					<image src="/static/images/menu/share-good.png"></image>
					<image src="/static/images/menu/close.png" @tap="closeGoodDetailModal"></image>
				</view>
			</view>
			<scroll-view class="detail" scroll-y>
				<view class="wrapper">
					<view class="basic">
						<view class="name">{{ selectedGood.name }}</view>
						<view class="tips">{{ selectedGood.content }}</view>
					</view>
					<view class="properties" v-if="selectedGood.use_property">
						<view class="property" v-for="(item, index) in selectedGood.property" :key="index">
							<view class="title">
								<text class="name">{{ item.name }}</text>
								<view class="desc" v-if="item.desc">({{ item.desc }})</view>
							</view>
							<view class="values">
								<view class="value" v-for="(value, key) in item.values" :key="key" 
								:class="{'default': value.is_default}" 
								@tap="handlePropertyChange(index, key)">
									{{ value.value }}
								</view>
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<view class="action">
				<view class="left">
					<view class="price">￥{{ selectedGood.price }}</view>
					<view class="props" v-if="selectedProps">
						{{ selectedProps }}
					</view>
				</view>
				<view class="btn-group">
					<button type="default" plain class="btn" size="mini" hover-class="none" 
						@tap="handlePropertyReduce">
						<view class="iconfont iconsami-select"></view>
					</button>
					<view class="number">{{ selectedGood.number }}</view>
					<button type="primary" class="btn" size="min" hover-class="none" 
						@tap="handlePropertyAdd">
						<view class="iconfont iconadd-select"></view>
					</button>
				</view>
			</view>
			<view class="add-to-cart-btn" @tap="handleAddToCartInModal">
				<view>加入购物车</view>
			</view>
		</modal>
		<popup-layer direction="top" :show-pop="cartPopupVisible" class="cart-popup">
			<template #content>
				<view class="top">
					<text @tap="handleCartClear">清空</text>
				</view>
				<scroll-view class="cart-list" scroll-y>
					<view class="wrapper">
						<view class="item" v-for="(item, index) in cartList" :key="index">
							<view class="left">
								<view class="name">{{ item.name }}</view>
								<view class="props">{{ item.props_text }}</view>
							</view>
							<view class="center">
								<text>￥{{ item.price }}</text>
							</view>
							<view class="right">
								<button type="default" plain size="mini" class="btn" hover-class="none"
									@tap="handleCartItemReduce(index)">
									<view class="iconfont iconsami-select"></view>
								</button>
								<view class="number">{{ item.number }}</view>
								<button type="primary" class="btn" size="min" hover-class="none"
									@tap="handleCartItemAdd(index)">
									<view class="iconfont iconadd-select"></view>
								</button>
							</view>
						</view>
						<view class="item" v-if="orderType === 'takeout' && store.packing_fee">
							<view class="left">
								<view class="name">包装费</view>
							</view>
							<view class="center">
								<text>￥{{ parseFloat(store.packing_fee) }}</text>
							</view>
							<view class="right invisible">
								<button type="default" plain size="mini" class="btn" hover-class="none">
									<view class="iconfont iconsami-select"></view>
								</button>
								<view class="number">1</view>
								<button type="primary" class="btn" size="min" hover-class="none">
									<view class="iconfont iconadd-select"></view>
								</button>
							</view>
						</view>
					</view>
				</scroll-view>
			</template>
		</popup-layer>
	</view>
	<view class="loading" v-else>
		<image src="/static/images/loading.gif"></image>
	</view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick } from 'vue'
import { useStore } from '@/store'
import { useRouter } from 'vue-router'
import type { Good, Category, CartItem } from '@/types'
import Modal from '@/components/modal/modal.vue'
import PopupLayer from '@/components/popup-layer/popup-layer.vue'

// Store
const store = useStore()
const router = useRouter()

// State
const loading = ref(false)
const orderType = ref('takein')
const currentCateId = ref(0)
const menuScrollIntoView = ref('')
const cateScrollTop = ref(0)
const goodDetailModalVisible = ref(false)
const cartPopupVisible = ref(false)
const selectedGood = ref<Good | null>(null)
const selectedCategory = ref<Category | null>(null)

// Props
const props = defineProps({
	goods: {
		type: Array as () => Category[],
		default: () => []
	},
	ads: {
		type: Array,
		default: () => []
	},
	store: {
		type: Object,
		required: true
	},
	address: {
		type: Object,
		default: () => ({})
	}
})

// Computed
const cartList = computed(() => store.state.cart.list)
const cartTotal = computed(() => store.getters['cart/total'])
const cartCount = computed(() => store.getters['cart/count'])
const deliverySpread = computed(() => {
	const minDeliveryAmount = store.state.config.minDeliveryAmount
	return Math.max(0, minDeliveryAmount - cartTotal.value).toFixed(2)
})
const isPayDisabled = computed(() => {
	return orderType.value === 'takeout' && cartTotal.value < store.state.config.minDeliveryAmount
})
const selectedProps = computed(() => {
	if (!selectedGood.value?.property) return ''
	return selectedGood.value.property
		.map(prop => prop.values.find(v => v.is_default)?.value)
		.filter(Boolean)
		.join('/')
})

// Methods
const handleOrderTypeChange = (type: string) => {
	orderType.value = type
}

const handleTakeout = () => {
	if (!store.state.user.address) {
		router.push('/pages/address/select')
		return
	}
	handleOrderTypeChange('takeout')
}

const handleMenuTap = (id: number) => {
	currentCateId.value = id
	menuScrollIntoView.value = `menu-${id}`
}

const menuCartNum = (categoryId: number) => {
	return cartList.value.reduce((acc, item) => {
		if (item.category_id === categoryId) {
			return acc + item.number
		}
		return acc
	}, 0)
}

const goodCartNum = (goodId: number) => {
	const item = cartList.value.find(item => item.id === goodId)
	return item?.number || 0
}

const showGoodDetailModal = (category: Category, good: Good) => {
	selectedCategory.value = category
	selectedGood.value = { ...good, number: 1 }
	goodDetailModalVisible.value = true
}

const closeGoodDetailModal = () => {
	goodDetailModalVisible.value = false
	selectedGood.value = null
	selectedCategory.value = null
}

const handlePropertyChange = (propIndex: number, valueIndex: number) => {
	if (!selectedGood.value?.property) return
	selectedGood.value.property = selectedGood.value.property.map((prop, idx) => {
		if (idx === propIndex) {
			return {
				...prop,
				values: prop.values.map((v, vidx) => ({
					...v,
					is_default: vidx === valueIndex
				}))
			}
		}
		return prop
	})
}

const handlePropertyAdd = () => {
	if (selectedGood.value) {
		selectedGood.value.number++
	}
}

const handlePropertyReduce = () => {
	if (selectedGood.value && selectedGood.value.number > 1) {
		selectedGood.value.number--
	}
}

const handleAddToCartInModal = () => {
	if (!selectedGood.value || !selectedCategory.value) return
	
	const cartItem: CartItem = {
		id: selectedGood.value.id,
		category_id: selectedCategory.value.id,
		name: selectedGood.value.name,
		price: selectedGood.value.price,
		number: selectedGood.value.number,
		props_text: selectedProps.value,
		property: selectedGood.value.property
	}
	
	store.dispatch('cart/add', cartItem)
	closeGoodDetailModal()
}

const handleAddToCart = (category: Category, good: Good, number: number) => {
	const cartItem: CartItem = {
		id: good.id,
		category_id: category.id,
		name: good.name,
		price: good.price,
		number,
		props_text: '',
		property: []
	}
	
	store.dispatch('cart/add', cartItem)
}

const handleReduceFromCart = (category: Category, good: Good) => {
	store.dispatch('cart/reduce', { id: good.id })
}

const handleCartItemAdd = (index: number) => {
	const item = cartList.value[index]
	store.dispatch('cart/add', { ...item, number: 1 })
}

const handleCartItemReduce = (index: number) => {
	const item = cartList.value[index]
	store.dispatch('cart/reduce', { id: item.id })
}

const handleCartClear = () => {
	store.dispatch('cart/clear')
	cartPopupVisible.value = false
}

const openCartPopup = () => {
	cartPopupVisible.value = true
}

const handleToPay = () => {
	router.push('/pages/order/confirm')
}

const handleGoodsScroll = (e: any) => {
	const { scrollTop } = e.detail
	// 根据滚动位置更新当前分类
	// 这里需要实现一个节流函数来优化性能
	updateCurrentCategory(scrollTop)
}

const updateCurrentCategory = (scrollTop: number) => {
	// 实现滚动时更新当前分类的逻辑
	// 可以使用 createSelectorQuery 获取每个分类的位置
}

// Lifecycle
onMounted(async () => {
	loading.value = true
	try {
		// 初始化数据加载
		await Promise.all([
			store.dispatch('config/load'),
			store.dispatch('user/load')
		])
	} finally {
		loading.value = false
	}
})
</script>

<style lang="scss">
@import './drink.scss';
</style>
