import os
import boto3
from dotenv import load_dotenv

load_dotenv()

# Bedrock runtime client for AI generation
bedrock_client = boto3.client(
    service_name="bedrock-runtime",
    region_name=os.getenv("AWS_REGION", "ap-southeast-2"),
)

# Bedrock agent runtime client for Knowledge Base retrieval
bedrock_agent_client = boto3.client(
    service_name="bedrock-agent-runtime",
    region_name=os.getenv("AWS_REGION", "ap-southeast-2"),
)

KNOWLEDGE_BASE_ID = os.getenv("KNOWLEDGE_BASE_ID", "")
MODEL_ID = os.getenv("MODEL_ID", "amazon.nova-lite-v1:0")


def retrieve_from_knowledge_base(query: str, num_results: int = 3) -> list:
    """
    Retrieve relevant documents from Amazon Bedrock Knowledge Base.
    
    Args:
        query: The search query
        num_results: Number of results to retrieve
    
    Returns:
        List of retrieved document chunks with content and metadata
    """
    if not KNOWLEDGE_BASE_ID:
        return []

    try:
        response = bedrock_agent_client.retrieve(
            knowledgeBaseId=KNOWLEDGE_BASE_ID,
            retrievalQuery={"text": query},
            retrievalConfiguration={
                "vectorSearchConfiguration": {
                    "numberOfResults": num_results
                }
            }
        )
        
        results = []
        for item in response.get("retrievalResults", []):
            results.append({
                "content": item["content"]["text"],
                "score":   item.get("score", 0),
                "source":  item.get("location", {}).get("s3Location", {}).get("uri", ""),
            })
        return results

    except Exception as e:
        print(f"Knowledge base retrieval error: {e}")
        return []


def generate_rag_recommendation(
    destination: str,
    days: int,
    budget: float,
    category: str,
) -> str:
    """
    Generate travel recommendation using RAG (Retrieval-Augmented Generation).
    Retrieves relevant documents from KB, then generates enhanced response.
    """
    # Step 1: Retrieve relevant context from Knowledge Base
    query = f"travel guide {destination} {days} days budget {category} tips activities food"
    retrieved_docs = retrieve_from_knowledge_base(query, num_results=3)

    # Step 2: Build context from retrieved documents
    context = ""
    if retrieved_docs:
        context = "\n\n## Relevant Knowledge Base Context:\n"
        for i, doc in enumerate(retrieved_docs, 1):
            context += f"\n### Source {i}:\n{doc['content']}\n"

    # Step 3: Build enriched prompt with retrieved context
    prompt = f"""You are an expert travel planner for KelanaAI. 
{context}

Using the knowledge base context above (if available) and your travel expertise, create a detailed {days}-day itinerary for {destination} with a total budget of ${budget:.2f} USD ({category} category).

For EACH day include:
Morning (2-3 specific activities with local tips):
- Specific landmarks or attractions
- Breakfast recommendations with local dishes and approximate prices
- Best time to visit to avoid crowds

Afternoon (cultural experiences):  
- Must-visit cultural sites or museums
- Local experiences unique to {destination}
- Lunch recommendations with local cuisine

Evening (dining & entertainment):
- Specific restaurant recommendations
- Evening entertainment or nightlife
- Estimated costs

Also include:
- Budget breakdown per day
- Local transportation tips
- Cultural etiquette to know
- Top 3 money-saving tips for {destination}

Format in Markdown with headers (##) and bullet lists (-).
Keep recommendations within the {category} budget level."""

    # Step 4: Generate response with Bedrock
    response = bedrock_client.converse(
        modelId=MODEL_ID,
        messages=[{"role": "user", "content": [{"text": prompt}]}]
    )

    ai_response = response["output"]["message"]["content"][0]["text"]
    
    # Step 5: Append RAG sources if available
    if retrieved_docs:
        ai_response += "\n\n---\n*This recommendation was enhanced using KelanaAI's Knowledge Base.*"
    
    return ai_response


def compare_rag_vs_base(question: str) -> dict:
    """
    Compare RAG answer vs base model answer for a given question.
    Returns both answers for comparison.
    """
    # Base model answer (no context)
    base_response = bedrock_client.converse(
        modelId=MODEL_ID,
        messages=[{"role": "user", "content": [{"text": question}]}]
    )
    base_answer = base_response["output"]["message"]["content"][0]["text"]

    # RAG answer (with knowledge base context)
    retrieved_docs = retrieve_from_knowledge_base(question, num_results=3)
    context = ""
    if retrieved_docs:
        context = "Based on the following travel knowledge:\n\n"
        for doc in retrieved_docs:
            context += doc["content"] + "\n\n"

    rag_prompt = f"{context}\n\nQuestion: {question}\n\nProvide a detailed, accurate answer based on the context above."
    
    rag_response = bedrock_client.converse(
        modelId=MODEL_ID,
        messages=[{"role": "user", "content": [{"text": rag_prompt}]}]
    )
    rag_answer = rag_response["output"]["message"]["content"][0]["text"]

    return {
        "question":     question,
        "base_answer":  base_answer,
        "rag_answer":   rag_answer,
        "sources_used": len(retrieved_docs),
        "sources":      [doc["source"] for doc in retrieved_docs],
    }
