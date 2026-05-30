import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Using a simple response pattern - in production, integrate with OpenAI, Claude, etc.
    const lowerMessage = message.toLowerCase()

    let reply = 'Thank you for your message. How else can I help you?'

    if (lowerMessage.includes('product') || lowerMessage.includes('price')) {
      reply = 'We have a wide range of products in Men, Women, Kids, Accessories, and Home & Kitchen categories. Would you like to browse our collections?'
    } else if (lowerMessage.includes('order') || lowerMessage.includes('purchase')) {
      reply = 'You can browse and order products directly from our website. Just visit the Products section to get started!'
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('whatsapp')) {
      reply = 'You can reach us on WhatsApp at 8840130533. Our team is here to help you 24/7!'
    } else if (lowerMessage.includes('delivery') || lowerMessage.includes('shipping')) {
      reply = 'We offer fast and reliable shipping across India. For more details, please contact us on WhatsApp.'
    } else if (lowerMessage.includes('discount') || lowerMessage.includes('offer')) {
      reply = 'We have amazing deals and discounts on various products. Check out our Best Deals section on the homepage!'
    } else if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      reply = 'Hello! Welcome to Wholesale Baazar. How can I assist you today?'
    }

    return NextResponse.json(
      { reply },
      { status: 200 }
    )
  } catch (error) {
    console.error('Chatbot API error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
