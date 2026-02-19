package com.greenneighbors.plant_swap_api.component;

import com.greenneighbors.plant_swap_api.model.*;
import com.greenneighbors.plant_swap_api.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private MemberRepository memberRepository;
    @Autowired private PlantRepository plantRepository;
    @Autowired private CategoryRepository categoryRepository;
    @Autowired private ExchangeRequestRepository requestRepository;
    @Autowired private FeedbackRepository feedbackRepository;

    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Override
    public void run(String... args) throws Exception {
        // Only run if the database is completely empty!
        if (memberRepository.count() == 0) {
            System.out.println("🌱 Database is empty. Seeding initial data...");

            // 1. Create Categories
            String[] catNames = {"Succulents", "Indoor Foliage", "Herbs", "Flowering", "Cacti"};
            List<Category> categories = new ArrayList<>();
            for (String name : catNames) {
                Category cat = new Category();
                cat.setName(name);
                categories.add(categoryRepository.save(cat));
            }

            // 2. Create Members (5-10 members)
            String[] names = {"Saman Kumara", "Nimali Perera", "Amila Silva", "Ruwanthi Fernando", "Kusal Mendis", "Piyumi Hansika"};
            String[] hoods = {"Colombo 03", "Kandy", "Galle", "Negombo", "Nugegoda", "Malabe"};
            List<Member> members = new ArrayList<>();

            for (int i = 0; i < names.length; i++) {
                Member m = new Member();
                m.setName(names[i]);
                m.setEmail("user" + i + "@example.com");
                m.setPassword(passwordEncoder.encode("password123"));
                m.setNeighborhood(hoods[i]);
                members.add(memberRepository.save(m));
            }

            // 3. Create Plants (20-30 plants)
            String[] plantNames = {"Aloe Vera", "Snake Plant", "Spider Plant", "Peace Lily", "Monstera", "Pothos", "Basil", "Mint", "Jade Plant", "ZZ Plant", "Orchid", "Cactus", "Fern", "Bonsai", "Ficus", "Ivy", "Bamboo", "Thyme", "Rosemary", "Lavender", "Philodendron"};
            List<Plant> plants = new ArrayList<>();
            Random random = new Random();

            for (String pName : plantNames) {
                Plant p = new Plant();
                p.setName(pName);
                p.setDescription("A healthy and beautiful " + pName + " looking for a new home.");
                p.setCareDifficulty(Plant.CareDifficulty.values()[random.nextInt(3)]); // Random EASY, MEDIUM, HARD
                p.setStatus(Plant.PlantStatus.AVAILABLE);
                p.setCategory(categories.get(random.nextInt(categories.size()))); // Random category
                p.setMember(members.get(random.nextInt(members.size()))); // Random owner
                plants.add(plantRepository.save(p));
            }

            // 4. Create a few Exchange Requests
            ExchangeRequest req1 = new ExchangeRequest();
            req1.setRequester(members.get(0)); // user0 wants user1's plant
            req1.setPlant(plants.get(1));
            req1.setMessage("Hi! I would love to trade my Aloe Vera for your Snake Plant.");
            req1.setStatus(ExchangeRequest.RequestStatus.PENDING);
            requestRepository.save(req1);

            ExchangeRequest req2 = new ExchangeRequest();
            req2.setRequester(members.get(2));
            req2.setPlant(plants.get(3));
            req2.setMessage("Is this Peace Lily still available?");
            req2.setStatus(ExchangeRequest.RequestStatus.COMPLETED); // A completed one!
            requestRepository.save(req2);

            // 5. Create Feedback
            Feedback f1 = new Feedback();
            f1.setReviewer(members.get(2));
            f1.setReviewedMember(members.get(plants.get(3).getMember().getId().intValue() - 1)); // The owner of plant 3
            f1.setRating(5);
            f1.setComments("Great swap! The plant was very healthy.");
            feedbackRepository.save(f1);

            System.out.println("✅ Data seeding complete!");
        } else {
            System.out.println("🌳 Database already contains data. Skipping seeder.");
        }
    }
}